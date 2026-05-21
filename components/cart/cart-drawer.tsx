"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FocusEvent } from "react";
import { PhoneCall, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCrossSells, getProductById, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/api";
import { createEventId } from "@/lib/event-id";
import { phoneExampleForMarket, validateGulfPhone } from "@/lib/phone";
import { trackEvent } from "@/lib/tracking";
import { formatMarketPrice, prefixMarketHref, type Market } from "@/lib/markets";
import { useCurrentMarket } from "@/lib/market-client";
import { makeCartItem, useCartStore, type CartItem } from "@/store/cart-store";
import { ProductVisual } from "@/components/ui/product-visual";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "اكتبي الاسم بشكل صحيح"),
  phone: z.string().trim().min(6, "اكتبي رقم الجوال"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

type CartDisplayGroup = {
  id: string;
  title: string;
  totalPrice: number;
  items: CartItem[];
  packId?: string;
};

function getCartDisplayGroups(items: CartItem[]): CartDisplayGroup[] {
  const groups: CartDisplayGroup[] = [];
  const seenPackIds = new Set<string>();

  items.forEach((item) => {
    if (!item.packId) {
      groups.push({
        id: `${item.productId}-${item.offerId}`,
        title: item.titleAr,
        totalPrice: item.totalPrice,
        items: [item],
      });
      return;
    }

    if (seenPackIds.has(item.packId)) return;
    seenPackIds.add(item.packId);
    const packItems = items.filter((candidate) => candidate.packId === item.packId);
    groups.push({
      id: item.packId,
      title: item.packName ?? "باقة مطبخ دفا",
      totalPrice: packItems.reduce((sum, candidate) => sum + candidate.totalPrice, 0),
      items: packItems,
      packId: item.packId,
    });
  });

  return groups;
}

export function CartDrawer() {
  const router = useRouter();
  const market = useCurrentMarket();
  const { items, isCartOpen, closeCart, removeItem, removePack, addItem, clearCart } = useCartStore();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<CheckoutValues | null>(null);
  const [pendingEventId, setPendingEventId] = useState("");
  const [isUpsellOpen, setUpsellOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartGroups = getCartDisplayGroups(items);
  const productIds = items.map((item) => item.productId);
  const crossSells = getCrossSells(productIds);
  const upsellOptions = useMemo(() => getCrossSells(productIds).slice(0, 1), [productIds]);
  const trackingItems = items.map((item) => ({
    product_id: item.productId,
    title_ar: item.titleAr,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
  }));

  useEffect(() => {
    function updateAppHeight() {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const offsetTop = viewport?.offsetTop ?? 0;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
      document.documentElement.style.setProperty("--app-offset-top", `${offsetTop}px`);
    }

    updateAppHeight();
    window.addEventListener("resize", updateAppHeight);
    window.visualViewport?.addEventListener("resize", updateAppHeight);
    window.visualViewport?.addEventListener("scroll", updateAppHeight);

    return () => {
      window.removeEventListener("resize", updateAppHeight);
      window.visualViewport?.removeEventListener("resize", updateAppHeight);
      window.visualViewport?.removeEventListener("scroll", updateAppHeight);
    };
  }, []);

  function addCrossSell(product: Product) {
    const item = makeCartItem(product, "one");
    addItem(item);
    trackEvent("AddToCart", {
      eventId: createEventId("atc"),
      value: item.totalPrice,
      currency: market.currency,
      productId: product.id,
      contentIds: [product.id],
      contentName: product.nameAr,
      items: [
        {
          product_id: product.id,
          title_ar: product.nameAr,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice,
        },
      ],
    });
  }

  function startCheckout() {
    const eventId = createEventId("checkout");
    setPendingEventId(eventId);
    setCheckoutOpen(true);
    trackEvent("InitiateCheckout", {
      eventId,
      value: total,
      currency: market.currency,
      contentIds: productIds,
      items: trackingItems,
    });
  }

  async function submitFinalOrder(values: CheckoutValues, eventId: string, acceptedUpsell: boolean, upsellItems: CartItem[] = []) {
    if (isSubmitting) return;
    setSubmitting(true);
    try {
      const phoneValidation = validateGulfPhone(values.phone, market);
      if (!phoneValidation.ok) throw new Error(phoneValidation.message);
      const normalized = phoneValidation.phone;
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
        market,
      });

      const finalItems = itemsForOrder;
      const finalTotal = finalItems.reduce((sum, item) => sum + item.totalPrice, 0);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "dafa-kitchen-last-order",
          JSON.stringify({
            orderId: response.order_id,
            customerName: values.name,
            phone: normalized.e164,
            total: finalTotal,
            items: finalItems,
            createdAt: new Date().toISOString(),
          }),
        );
      }
      trackEvent("Purchase", {
        eventId: response.purchase_event_id,
        value: finalTotal,
        currency: market.currency,
        contentIds: finalItems.map((item) => item.productId),
        items: finalItems.map((item) => ({
          product_id: item.productId,
          title_ar: item.titleAr,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice,
        })),
        name: values.name,
        phone: normalized.e164,
        sendServer: false,
        metadata: { order_id: response.order_id },
      });
      clearCart();
      router.push(`${prefixMarketHref("/thank-you", market)}?order=${encodeURIComponent(response.order_id)}&total=${finalTotal}`);
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
        className={`fixed inset-y-0 left-0 z-50 flex h-[var(--app-height,100dvh)] max-h-[var(--app-height,100dvh)] w-full max-w-md flex-col bg-warm-50 shadow-soft transition duration-300 ${
          isCartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="سلة التسوق"
      >
        <div className="shrink-0 flex items-center justify-between border-b border-charcoal/10 p-4 sm:p-5">
          <div>
            <h2 className="text-xl font-black">سلة الطلب</h2>
            <p className="text-xs text-charcoal/60">الدفع عند الاستلام - نؤكد الطلب قبل الشحن</p>
          </div>
          <button className="focus-ring rounded-lg bg-white p-2" onClick={closeCart} aria-label="إغلاق السلة">
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center">
              <p className="font-black">السلة فارغة</p>
              <p className="mt-2 text-sm text-charcoal/60">اختاري منتج أو باقة، والدفع يكون عند الاستلام بعد التأكيد.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {cartGroups.map((group) => {
                const previewProduct = getProductById(group.items[0].productId);

                return (
                <div key={group.id} className="rounded-2xl bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    {!group.packId && previewProduct ? (
                      <ProductVisual
                        product={previewProduct}
                        compact
                        className="w-24 shrink-0 rounded-xl shadow-none"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="font-black">{group.title}</p>
                      {group.packId ? (
                        <div className="mt-2 grid gap-1">
                          {group.items.map((item) => (
                            <p key={`${item.productId}-${item.offerId}`} className="text-xs font-bold leading-5 text-charcoal/55">
                              {item.titleAr.replace(` - ضمن ${group.title}`, "")}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="focus-ring rounded-lg p-2 text-red-700 hover:bg-red-50"
                      onClick={() => (group.packId ? removePack(group.packId) : removeItem(group.items[0].productId, group.items[0].offerId))}
                      aria-label={group.packId ? "حذف الباقة" : "حذف المنتج"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="mt-3 text-lg font-black">{formatMarketPrice(group.totalPrice, market)}</p>
                </div>
                );
              })}
            </div>
          )}

          {crossSells.length > 0 && items.length > 0 ? (
            <div className="mt-6">
              <h3 className="mb-3 font-black">قد يناسب طلبك</h3>
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
                      <span className="text-xs text-charcoal/60">أضيفيه لنفس الطلب بدل شحنة ثانية</span>
                      </span>
                    </span>
                    <Plus className="shrink-0" size={18} />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-charcoal/10 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between text-lg font-black">
            <span>الإجمالي</span>
            <span>{formatMarketPrice(total, market)}</span>
          </div>
          <Button disabled={items.length === 0} onClick={startCheckout} className="w-full" variant="gold">
            إتمام الطلب
          </Button>
        </div>
      </aside>

      {isCheckoutOpen ? (
        <CheckoutModal
          market={market}
          groups={cartGroups}
          total={total}
          isSubmitting={isSubmitting}
          onClose={() => setCheckoutOpen(false)}
          onSubmit={(values) => {
            trackEvent("Lead", {
              eventId: createEventId("lead"),
              value: total,
              currency: market.currency,
              contentIds: productIds,
              items: trackingItems,
              name: values.name,
              phone: values.phone,
            });
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
          market={market}
          products={upsellOptions}
          isSubmitting={isSubmitting}
          onAccept={(selectedProducts) => {
            trackEvent("UpsellAccepted", {
              eventId: createEventId("upsell_accept"),
              value: 99,
              currency: market.currency,
              productId: selectedProducts[0]?.id,
              contentIds: selectedProducts.map((product) => product.id),
              name: pendingCustomer.name,
              phone: pendingCustomer.phone,
            });
            void submitFinalOrder(
              pendingCustomer,
              pendingEventId,
              true,
              selectedProducts.map((product) => makeCartItem(product, "upsell_99")),
            );
          }}
          onSkip={() => {
            trackEvent("UpsellRejected", {
              eventId: createEventId("upsell_reject"),
              value: total,
              currency: market.currency,
              contentIds: productIds,
              items: trackingItems,
              name: pendingCustomer.name,
              phone: pendingCustomer.phone,
            });
            void submitFinalOrder(pendingCustomer, pendingEventId, false);
          }}
        />
      ) : null}
    </>
  );
}

function CheckoutModal({
  market,
  groups,
  total,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  market: Market;
  groups: CartDisplayGroup[];
  total: number;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: CheckoutValues) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isFieldFocused, setFieldFocused] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema) });
  const phoneExample = phoneExampleForMarket(market.code);

  function submitWithPhoneValidation(values: CheckoutValues) {
    const phoneValidation = validateGulfPhone(values.phone, market);
    if (!phoneValidation.ok) {
      setError("phone", { type: "validate", message: phoneValidation.message });
      return;
    }
    onSubmit(values);
  }

  function handleInputFocus(event: FocusEvent<HTMLInputElement>) {
    setFieldFocused(true);
    const input = event.currentTarget;

    window.setTimeout(() => {
      input.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 120);
  }

  function handleBlurCapture() {
    window.setTimeout(() => {
      if (!modalRef.current?.contains(document.activeElement)) {
        setFieldFocused(false);
      }
    }, 0);
  }

  return (
    <div
      className={`fixed inset-x-0 top-[var(--app-offset-top,0px)] z-[60] flex h-[var(--app-height,100dvh)] justify-center overflow-y-auto overscroll-contain bg-charcoal/55 p-3 backdrop-blur-md sm:p-4 ${
        isFieldFocused ? "items-start" : "items-center"
      }`}
    >
      <div
        ref={modalRef}
        onBlurCapture={handleBlurCapture}
        className="max-h-[calc(var(--app-height,100dvh)-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-soft sm:max-h-[calc(var(--app-height,100dvh)-2rem)] sm:p-5"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black">تأكيد الطلب</h2>
            <p className="mt-1 text-sm text-charcoal/60">راجعي المنتجات والمبلغ، وبعدها نكلمك لتأكيد العنوان قبل الشحن</p>
          </div>
          <button type="button" onClick={onClose} className="focus-ring rounded-lg bg-warm-100 p-2">
            <X size={18} />
          </button>
        </div>
        <div className="mb-5 rounded-2xl bg-warm-50 p-4">
          <div className="mb-4 border-b border-charcoal/10 pb-4">
            <p className="mb-3 text-sm font-black">المنتجات في طلبك</p>
            <div className="grid gap-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm"
                >
                  <span className="font-bold">{group.title}</span>
                  <span className="flex shrink-0 items-center gap-3 text-xs font-black text-charcoal/60">
                    <span>{group.packId ? "باقة" : `x${group.items[0].quantity}`}</span>
                    <span className="text-sm text-charcoal">{formatMarketPrice(group.totalPrice, market)}</span>
                    <span className="hidden">
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between font-black">
            <span>الإجمالي عند الاستلام</span>
            <span>{formatMarketPrice(total, market)}</span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs font-bold text-olive">
            <ShieldCheck size={14} /> نحجز الكمية للطلبات المؤكدة فقط.
          </p>
        </div>
        <div className="mb-4 rounded-2xl border border-gold/30 bg-[#FFF7E4] p-4 text-sm font-bold leading-7 text-date">
          <span className="flex items-start gap-2">
            <PhoneCall size={18} className="mt-1 shrink-0" />
            بعد إرسال الطلب بنتصل عليك لتأكيد المنتجات والكمية والعنوان. الرد على المكالمة يحجز طلبك للتجهيز أسرع.
          </span>
        </div>
        <form onSubmit={handleSubmit(submitWithPhoneValidation)} className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold">
            الاسم
            <input
              className="focus-ring rounded-xl border border-charcoal/15 bg-warm-50 px-4 py-3"
              onFocus={handleInputFocus}
              {...register("name")}
            />
            {errors.name ? <span className="text-xs text-red-700">{errors.name.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm font-bold">
            رقم الجوال في {market.countryNameAr}
            <input
              className="focus-ring rounded-xl border border-charcoal/15 bg-warm-50 px-4 py-3 text-right"
              placeholder={phoneExample}
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              onFocus={handleInputFocus}
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
  market,
  products,
  isSubmitting,
  onAccept,
  onSkip,
}: {
  market: Market;
  products: Product[];
  isSubmitting: boolean;
  onAccept: (products: Product[]) => void;
  onSkip: () => void;
}) {
  const offerSeconds = 30;
  const [secondsLeft, setSecondsLeft] = useState(offerSeconds);
  const upsellProduct = products[0];
  const progress = (secondsLeft / offerSeconds) * 100;
  const hasResolvedRef = useRef(false);

  const acceptOffer = useCallback(() => {
    if (!upsellProduct || hasResolvedRef.current || isSubmitting) return;
    hasResolvedRef.current = true;
    onAccept([upsellProduct]);
  }, [isSubmitting, onAccept, upsellProduct]);

  const skipOffer = useCallback(() => {
    if (hasResolvedRef.current || isSubmitting) return;
    hasResolvedRef.current = true;
    onSkip();
  }, [isSubmitting, onSkip]);

  useEffect(() => {
    if (!upsellProduct) return;
    trackEvent("UpsellView", {
      eventId: createEventId("upsell_view"),
      value: 99,
      currency: market.currency,
      productId: upsellProduct.id,
      contentIds: [upsellProduct.id],
      contentName: upsellProduct.nameAr,
    });
  }, [upsellProduct]);

  useEffect(() => {
    if (isSubmitting || hasResolvedRef.current) return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const nextSecondsLeft = Math.max(offerSeconds - elapsedSeconds, 0);
      setSecondsLeft(nextSecondsLeft);

      if (nextSecondsLeft === 0) {
        window.clearInterval(timer);
        skipOffer();
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [isSubmitting, skipOffer]);

  return (
    <div className="fixed inset-0 z-[70] flex h-[var(--app-height,100dvh)] items-center justify-center overflow-y-auto overscroll-contain bg-charcoal/60 p-3 backdrop-blur-md sm:p-4">
      <div className="max-h-[calc(var(--app-height,100dvh)-1.5rem)] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-4 shadow-soft sm:max-h-[calc(var(--app-height,100dvh)-2rem)] sm:p-5">
        <div className="text-center">
          <p className="text-sm font-black text-gold">فرصة قبل تجهيز الشحنة</p>
          <h2 className="mt-2 text-2xl font-black">أضيفي منتج مكمل بـ {formatMarketPrice(99, market)} فقط</h2>
          <p className="mt-3 text-sm leading-7 text-charcoal/65">نضيفه لنفس الطلب ونؤكده معك في نفس المكالمة، بدون طلب جديد أو شحنة ثانية.</p>
        </div>

        <div className="mt-5 rounded-2xl bg-warm-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-black text-charcoal/65">
            <span>يبقى متاحا خلال</span>
            <span>{secondsLeft} ثانية</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {upsellProduct ? (
          <div className="my-5 grid gap-3">
            <div
              className={`grid gap-4 rounded-2xl border border-gold bg-[#FFF8E8] p-4 text-start ${
                isSubmitting ? "opacity-70" : ""
              }`}
            >
              <ProductVisual product={upsellProduct} ratio="wide" className="w-full rounded-xl shadow-none" />
              <span className="flex min-w-0 items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-black">{upsellProduct.nameAr}</span>
                  <span className="mt-1 block text-sm font-black text-date">سعر خاص لأنه مع نفس الطلب</span>
                </span>
                <span className="shrink-0 rounded-xl bg-gold px-4 py-2 text-sm font-black text-charcoal">{formatMarketPrice(99, market)}</span>
              </span>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3">
          <Button onClick={acceptOffer} disabled={isSubmitting || !upsellProduct} variant="gold" className="w-full">
            أضيفيه مع طلبي بـ {formatMarketPrice(99, market)}
          </Button>
          <Button onClick={skipOffer} disabled={isSubmitting} variant="outline" className="w-full">
            لا، أكملي طلبي الحالي
          </Button>
        </div>
      </div>
    </div>
  );
}
