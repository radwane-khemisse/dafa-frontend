"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, PhoneCall, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCrossSells, getProductById, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/api";
import { createEventId } from "@/lib/event-id";
import { normalizeKsaPhone } from "@/lib/phone";
import { trackPixelEvent } from "@/lib/tracking";
import { makeCartItem, useCartStore, type CartItem } from "@/store/cart-store";
import { ProductVisual } from "@/components/ui/product-visual";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "اكتبي الاسم بشكل صحيح"),
  phone: z.string().refine((value) => normalizeKsaPhone(value) !== null, "اكتبي رقم جوال سعودي صحيح"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CartDrawer() {
  const router = useRouter();
  const { items, isCartOpen, closeCart, removeItem, addItem, clearCart } = useCartStore();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<CheckoutValues | null>(null);
  const [pendingEventId, setPendingEventId] = useState("");
  const [isUpsellOpen, setUpsellOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const productIds = items.map((item) => item.productId);
  const crossSells = getCrossSells(productIds);
  const upsellOptions = useMemo(() => getCrossSells(productIds), [productIds]);

  function addCrossSell(product: Product) {
    addItem(makeCartItem(product, "one"));
    trackPixelEvent("AddToCart", { value: 199, currency: "SAR", content_ids: [product.id] }, createEventId("atc"));
  }

  function startCheckout() {
    const eventId = createEventId("checkout");
    setPendingEventId(eventId);
    setCheckoutOpen(true);
    trackPixelEvent("InitiateCheckout", { value: total, currency: "SAR", content_ids: productIds }, eventId);
  }

  async function submitFinalOrder(values: CheckoutValues, eventId: string, acceptedUpsell: boolean, upsellItems: CartItem[] = []) {
    setSubmitting(true);
    try {
      const normalized = normalizeKsaPhone(values.phone);
      if (!normalized) throw new Error("رقم الجوال غير صحيح");
      const itemsForOrder = [...useCartStore.getState().items, ...upsellItems];
      closeCart();
      setUpsellOpen(false);
      setCheckoutOpen(false);

      const response = await createOrder({
        eventId,
        name: values.name,
        phone: normalized.e164,
        items: itemsForOrder,
        upsellAccepted: acceptedUpsell,
      });

      const finalItems = itemsForOrder;
      const finalTotal = finalItems.reduce((sum, item) => sum + item.totalPrice, 0);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "dafa-kitchen-last-order",
          JSON.stringify({
            orderId: response.order_id,
            total: finalTotal,
            items: finalItems,
            createdAt: new Date().toISOString(),
          }),
        );
      }
      trackPixelEvent(
        "Purchase",
        {
          value: finalTotal,
          currency: "SAR",
          content_ids: finalItems.map((item) => item.productId),
          contents: finalItems.map((item) => ({ id: item.productId, quantity: item.quantity })),
        },
        eventId,
      );
      clearCart();
      router.push(`/thank-you?order=${encodeURIComponent(response.order_id)}&total=${finalTotal}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "تعذر تأكيد الطلب، حاولي مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-charcoal/35 transition ${isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col bg-warm-50 shadow-soft transition duration-300 ${
          isCartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="سلة التسوق"
      >
        <div className="flex items-center justify-between border-b border-charcoal/10 p-5">
          <div>
            <h2 className="text-xl font-black">سلة الطلب</h2>
            <p className="text-xs text-charcoal/60">الدفع عند الاستلام - نؤكد الطلب قبل الشحن</p>
          </div>
          <button className="focus-ring rounded-lg bg-white p-2" onClick={closeCart} aria-label="إغلاق السلة">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center">
              <p className="font-black">السلة فارغة</p>
              <p className="mt-2 text-sm text-charcoal/60">اختاري عرض من المنتجات لإتمام الطلب.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {items.map((item) => (
                <div key={`${item.productId}-${item.offerId}`} className="rounded-2xl bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    {getProductById(item.productId) ? (
                      <ProductVisual
                        product={getProductById(item.productId)!}
                        compact
                        className="w-24 shrink-0 rounded-xl shadow-none"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="font-black">{item.titleAr}</p>
                      <p className="text-sm text-charcoal/60">الكمية: {item.quantity}</p>
                    </div>
                    <button
                      type="button"
                      className="focus-ring rounded-lg p-2 text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.productId, item.offerId)}
                      aria-label="حذف المنتج"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="mt-3 text-lg font-black">{item.totalPrice} ريال</p>
                </div>
              ))}
            </div>
          )}

          {crossSells.length > 0 && items.length > 0 ? (
            <div className="mt-6">
              <h3 className="mb-3 font-black">كملي تجهيز مطبخك</h3>
              <div className="grid gap-3">
                {crossSells.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => addCrossSell(product)}
                    className="focus-ring flex items-center justify-between gap-3 rounded-2xl border border-charcoal/10 bg-white p-3 text-start hover:border-gold"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <ProductVisual product={product} compact className="w-24 shrink-0 rounded-xl shadow-none" />
                      <span className="min-w-0">
                      <span className="block font-black">{product.nameAr}</span>
                      <span className="line-clamp-2 text-xs text-charcoal/60">{product.headlineAr}</span>
                      <span className="text-xs text-charcoal/60">أضيفيها للطلب من 199 ريال</span>
                      </span>
                    </span>
                    <Plus className="shrink-0" size={18} />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-charcoal/10 bg-white p-5">
          <div className="mb-4 flex items-center justify-between text-lg font-black">
            <span>الإجمالي</span>
            <span>{total} ريال</span>
          </div>
          <Button disabled={items.length === 0} onClick={startCheckout} className="w-full" variant="gold">
            إتمام الطلب
          </Button>
        </div>
      </aside>

      {isCheckoutOpen ? (
        <CheckoutModal
          items={items}
          total={total}
          isSubmitting={isSubmitting}
          onClose={() => setCheckoutOpen(false)}
          onSubmit={(values) => {
            setPendingCustomer(values);
            setCheckoutOpen(false);
            if (upsellOptions.length > 0) {
              setUpsellOpen(true);
            } else {
              void submitFinalOrder(values, pendingEventId, false);
            }
          }}
        />
      ) : null}

      {isUpsellOpen && pendingCustomer && upsellOptions.length > 0 ? (
        <UpsellModal
          products={upsellOptions}
          isSubmitting={isSubmitting}
          onAccept={(selectedProducts) => {
            void submitFinalOrder(
              pendingCustomer,
              pendingEventId,
              true,
              selectedProducts.map((product) => makeCartItem(product, "upsell_99")),
            );
          }}
          onSkip={() => void submitFinalOrder(pendingCustomer, pendingEventId, false)}
        />
      ) : null}
    </>
  );
}

function CheckoutModal({
  items,
  total,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  items: CartItem[];
  total: number;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: CheckoutValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema) });

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-charcoal/55 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black">تأكيد الطلب</h2>
            <p className="mt-1 text-sm text-charcoal/60">+1200 عميلة وثقوا في مطبخ دفا لتحسين ترتيب وتجهيز المطبخ</p>
          </div>
          <button type="button" onClick={onClose} className="focus-ring rounded-lg bg-warm-100 p-2">
            <X size={18} />
          </button>
        </div>
        <div className="mb-5 rounded-2xl bg-warm-50 p-4">
          <div className="mb-4 border-b border-charcoal/10 pb-4">
            <p className="mb-3 text-sm font-black">المنتجات في طلبك</p>
            <div className="grid gap-2">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.offerId}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm"
                >
                  <span className="font-bold">{item.titleAr}</span>
                  <span className="flex shrink-0 items-center gap-3 text-xs font-black text-charcoal/60">
                    <span>x{item.quantity}</span>
                    <span className="text-sm text-charcoal">{item.totalPrice} ريال</span>
                    <span className="hidden">
                    x{item.quantity} - {item.totalPrice} ريال
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between font-black">
            <span>الإجمالي عند الاستلام</span>
            <span>{total} ريال</span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs font-bold text-olive">
            <ShieldCheck size={14} /> نحجز الكمية للطلبات المؤكدة فقط.
          </p>
        </div>
        <div className="mb-4 rounded-2xl border border-gold/30 bg-[#FFF7E4] p-4 text-sm font-bold leading-7 text-date">
          <span className="flex items-start gap-2">
            <PhoneCall size={18} className="mt-1 shrink-0" />
            بعد إرسال الطلب سنتصل بك لتأكيد الشراء قبل الشحن، خليك قريبة من جوالك عشان ما يتأخر طلبك.
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold">
            الاسم
            <input className="focus-ring rounded-xl border border-charcoal/15 bg-warm-50 px-4 py-3" {...register("name")} />
            {errors.name ? <span className="text-xs text-red-700">{errors.name.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm font-bold">
            رقم الجوال السعودي
            <input
              className="focus-ring rounded-xl border border-charcoal/15 bg-warm-50 px-4 py-3"
              placeholder="05XXXXXXXX"
              dir="rtl"
              inputMode="tel"
              {...register("phone")}
            />
            {errors.phone ? <span className="text-xs text-red-700">{errors.phone.message}</span> : null}
          </label>
          <Button type="submit" disabled={isSubmitting} variant="gold" className="w-full">
            {isSubmitting ? "جاري التأكيد..." : "تأكيد الطلب"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function UpsellModal({
  products,
  isSubmitting,
  onAccept,
  onSkip,
}: {
  products: Product[];
  isSubmitting: boolean;
  onAccept: (products: Product[]) => void;
  onSkip: () => void;
}) {
  const offerSeconds = 20;
  const [secondsLeft, setSecondsLeft] = useState(offerSeconds);
  const [selectedProductIds, setSelectedProductIds] = useState<Array<Product["id"]>>([]);
  const selectedProducts = products.filter((product) => selectedProductIds.includes(product.id));
  const upsellTotal = selectedProducts.length * 99;
  const originalTotal = selectedProducts.length * 199;
  const savings = originalTotal - upsellTotal;
  const progress = (secondsLeft / offerSeconds) * 100;

  useEffect(() => {
    if (isSubmitting) return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const nextSecondsLeft = Math.max(offerSeconds - elapsedSeconds, 0);
      setSecondsLeft(nextSecondsLeft);

      if (nextSecondsLeft === 0) {
        window.clearInterval(timer);
        onSkip();
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [isSubmitting, onSkip]);

  function toggleProduct(productId: Product["id"]) {
    setSelectedProductIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-charcoal/60 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-soft">
        <div className="text-center">
          <p className="text-sm font-black text-gold">عرض خاص قبل تأكيد الطلب</p>
          <h2 className="mt-2 text-2xl font-black">اختاري منتج مكمل بـ 99 ريال فقط</h2>
          <p className="mt-3 text-sm leading-7 text-charcoal/65">أضيفيه مع نفس الشحنة وبدون طلب جديد. العرض يظهر مرة واحدة فقط.</p>
        </div>

        <div className="mt-5 rounded-2xl bg-warm-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-black text-charcoal/65">
            <span>ينتهي العرض خلال</span>
            <span>{secondsLeft} ثانية</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="my-5 rounded-3xl border border-gold/35 bg-gradient-to-br from-[#FFF8E8] via-white to-[#EFE2CF] p-6 text-center">
          <p className="text-sm font-black text-date">السعر الخاص الآن</p>
          <div className="mt-2 flex items-end justify-center gap-3">
            <span className="text-6xl font-black leading-none text-charcoal">{upsellTotal || 0}</span>
            <span className="pb-2 text-xl font-black text-charcoal">ريال</span>
          </div>
          <p className="hidden">
            بدلا من <span className="line-through">199 ريال</span> - وفري 100 ريال
          </p>
          <p className="mt-3 text-sm font-bold text-charcoal/55">
            {selectedProducts.length > 0 ? (
              <>
                {selectedProducts.length} منتج x 99 ريال - بدلا من <span className="line-through">{originalTotal} ريال</span> - وفري {savings} ريال
              </>
            ) : (
              "اختاري منتجا واحدا أو أكثر لحساب العرض"
            )}
          </p>
        </div>

        <div className="grid gap-3">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => toggleProduct(product.id)}
              className={`focus-ring flex items-center justify-between gap-4 rounded-2xl border p-3 text-start transition ${
                selectedProductIds.includes(product.id)
                  ? "border-gold bg-[#FFF8E8]"
                  : "border-charcoal/10 bg-warm-50 hover:bg-white"
              }`}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <ProductVisual product={product} compact className="w-24 shrink-0 rounded-xl shadow-none" />
                <span className="min-w-0">
                  <span className="block font-black">{product.nameAr}</span>
                  <span className="line-clamp-2 text-xs text-charcoal/60">{product.headlineAr}</span>
                </span>
              </span>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${
                  selectedProductIds.includes(product.id) ? "border-olive bg-olive text-white" : "border-charcoal/20 bg-white"
                }`}
                aria-hidden="true"
              >
                {selectedProductIds.includes(product.id) ? <CheckCircle2 size={18} /> : null}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          <Button onClick={() => onAccept(selectedProducts)} disabled={isSubmitting || selectedProducts.length === 0} variant="gold" className="mt-5 w-full text-[0px] [&>span]:text-sm">
            <span className="text-sm text-charcoal">أضيفي العرض</span>
            <span className="hidden">أضيفي {selectedProducts.length || ""} منتج للطلب - {upsellTotal || 0} ريال</span>
            أضيفي المنتج المختار بـ 99 ريال
          </Button>
          <Button onClick={onSkip} disabled={isSubmitting} variant="outline" className="w-full">
            متابعة بدون العرض
          </Button>
        </div>
      </div>
    </div>
  );
}
