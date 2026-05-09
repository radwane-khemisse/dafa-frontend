"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Headphones,
  MapPin,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { getCrossSells, getProductById } from "@/data/products";
import { ProductCard } from "@/components/product/product-card";
import type { CartItem } from "@/store/cart-store";
import { ProductVisual } from "@/components/ui/product-visual";

type LastOrderSnapshot = {
  orderId?: string;
  customerName?: string;
  phone?: string;
  total?: number;
  items?: CartItem[];
  createdAt?: string;
};

const trustReviews = [
  {
    name: "أم نورة",
    city: "الرياض",
    text: "رديت على مكالمة التأكيد ووصل الطلب بدون لخبطة. جربت المنتج وفرق معي في ترتيب المطبخ.",
  },
  {
    name: "سارة",
    city: "جدة",
    text: "المكالمة كانت قصيرة وواضحة. بعد ما استخدمته حسيت أنه عملي فعلا وريحني في التحضير.",
  },
  {
    name: "أم عبدالعزيز",
    city: "الدمام",
    text: "كنت مترددة من الرقم غير المحفوظ، لكن طلع اتصال التأكيد. المنتج وصل مثل الطلب واستخدامه سهل.",
  },
];

export function ThankYouSummary({ fallbackOrderId, fallbackTotal }: { fallbackOrderId: string; fallbackTotal?: string }) {
  const [snapshot, setSnapshot] = useState<LastOrderSnapshot | null>(null);
  const [callMessage, setCallMessage] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setCallMessage(
      hour >= 9 && hour < 21
        ? "خليك قريبة من الجوال الآن. نحاول الاتصال خلال أقل من 10 دقائق لتأكيد العنوان."
        : "طلبك محفوظ. بنتصل عليك في بداية وقت العمل صباحا من 9 صباحا لتأكيد العنوان.",
    );

    const rawSnapshot = window.localStorage.getItem("dafa-kitchen-last-order");
    if (!rawSnapshot) {
      setSnapshot(null);
      return;
    }

    try {
      setSnapshot(JSON.parse(rawSnapshot) as LastOrderSnapshot);
    } catch {
      setSnapshot(null);
    }
  }, []);

  const orderedItems = snapshot?.items ?? [];
  const suggestedProducts = getCrossSells(orderedItems.map((item) => item.productId)).slice(0, 3);
  const total = snapshot?.total ?? Number(fallbackTotal || 0);

  return (
    <div className="mt-6 grid gap-6">
      <section className="rounded-2xl border border-gold/35 bg-[#FFF7E4] p-5 shadow-soft md:p-6">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gold text-charcoal">
            <PhoneCall size={30} />
          </div>
          <div>
            <p className="text-sm font-black text-date">الأولوية الآن</p>
            <h2 className="mt-1 text-2xl font-black leading-tight">ردي على مكالمة التأكيد حتى يبدأ تجهيز طلبك</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-charcoal/70">{callMessage}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <InfoTile icon={MessageCircle} label="سنؤكد" value="المنتج والمبلغ" />
          <InfoTile icon={MapPin} label="سنراجع" value="المدينة والحي والعنوان" />
          <InfoTile icon={Truck} label="ثم نبدأ" value="تجهيز الشحنة" />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.74fr]">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft md:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black text-olive">ملخص الطلب</p>
              <h2 className="mt-1 text-2xl font-black">{snapshot?.orderId || fallbackOrderId}</h2>
            </div>
            {total ? <p className="rounded-xl bg-warm-50 px-4 py-2 text-xl font-black">{total} ريال</p> : null}
          </div>

          <div className="mb-5 grid gap-3 md:grid-cols-2">
            <InfoTile label="الاسم المسجل" value={snapshot?.customerName || "حسب بيانات الطلب"} />
            <InfoTile label="رقم الجوال للتأكيد" value={snapshot?.phone?.replace("+", "") || "نفس الرقم المستخدم في الطلب"} />
          </div>

          {orderedItems.length ? (
            <div className="grid gap-3">
              {orderedItems.map((item) => {
                const product = getProductById(item.productId);

                return (
                  <div
                    key={`${item.productId}-${item.offerId}`}
                    className="grid grid-cols-[88px_1fr] gap-4 rounded-xl border border-charcoal/10 bg-warm-50 p-3 sm:grid-cols-[104px_1fr_auto] sm:items-center"
                  >
                    {product ? <ProductVisual product={product} compact className="w-full rounded-lg shadow-none" /> : <div className="h-20 rounded-lg bg-white" />}
                    <div className="min-w-0">
                      <p className="font-black leading-7">{item.titleAr}</p>
                      <p className="mt-1 text-sm font-bold text-charcoal/58">الكمية: {item.quantity}</p>
                      <p className="mt-1 text-sm text-charcoal/50">سعر القطعة: {item.unitPrice} ريال</p>
                    </div>
                    <div className="col-span-2 rounded-lg bg-white px-3 py-2 text-start sm:col-span-1 sm:min-w-28 sm:text-center">
                      <p className="text-xs font-bold text-charcoal/50">الإجمالي</p>
                      <p className="text-xl font-black">{item.totalPrice} ريال</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl bg-warm-50 p-4 text-sm font-bold text-charcoal/65">تم حفظ الطلب. سيظهر ملخص المنتجات هنا عند الرجوع من نفس الجهاز.</p>
          )}
        </div>

        <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft md:p-6">
          <p className="text-sm font-black text-olive">بعد الرد على المكالمة</p>
          <h2 className="mt-1 text-2xl font-black">الخطوات واضحة</h2>
          <div className="mt-6 grid gap-5">
            <TimelineItem icon={Headphones} title="تأكيد سريع" text="نتأكد من المنتج، المبلغ، ورقم الجوال." />
            <TimelineItem icon={MapPin} title="عنوان واضح" text="نراجع المدينة والحي وأقرب معلم لتقليل تأخير التوصيل." />
            <TimelineItem icon={PackageCheck} title="تجهيز الشحنة" text="بعد التأكيد نبدأ تجهيز الطلب للشحن." />
            <TimelineItem icon={Truck} title="الدفع عند الاستلام" text="تدفعين فقط عند وصول الطلب." />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-soft md:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black text-olive">ثقة قبل التوصيل</p>
            <h2 className="mt-1 text-2xl font-black">عميلات جاوبوا المكالمة واستلموا براحة</h2>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-warm-50 px-3 py-2 text-xs font-black text-date">
            <Star size={15} className="fill-gold text-gold" /> تجارب عميلات
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {trustReviews.map((review) => (
            <TrustReviewCard key={`${review.name}-${review.city}`} {...review} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-olive p-5 text-white shadow-soft md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-black text-gold">لتسريع التوصيل</p>
            <h2 className="mt-1 text-2xl font-black">حضري العنوان قبل المكالمة</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-white/72">المدينة، الحي، الشارع، وأقرب معلم. كلما كان العنوان واضحا، صار تجهيز الشحنة أسرع.</p>
          </div>
          
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft md:p-6">
          <ShieldCheck className="text-olive" size={30} />
          <h2 className="mt-4 text-2xl font-black">لماذا نؤكد الطلب؟</h2>
          <p className="mt-3 text-sm font-bold leading-7 text-charcoal/65">
            التأكيد يحميك من عنوان ناقص أو شحنة غير مقصودة، ويساعدنا نرسل الطلب الجاد بسرعة ونحافظ على تجربة دفع عند الاستلام مرتبة.
          </p>
          <div className="mt-5 grid gap-2 text-sm font-black text-date">
            <p>+ الدفع عند الاستلام</p>
            <p>+ اتصال تأكيد قبل الشحن</p>
            <p>+ ضمان ذهبي 30 يوم</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-black text-olive">كملي تجهيز مطبخك</p>
          <h2 className="mt-1 text-2xl font-black">منتجات تناسب طلبك</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-charcoal/62">إذا احتجت منتج مكمل، تقدرين تضيفينه كطلب جديد الآن ونؤكده معك بنفس طريقة الاتصال.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {suggestedProducts.length ? (
              suggestedProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <Link href="/products" className="focus-ring rounded-xl bg-warm-50 p-5 text-center font-black text-date">
                عرض كل المنتجات
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoTile({ label, value, icon: Icon }: { label: string; value: string; icon?: LucideIcon }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        {Icon ? <Icon size={16} className="text-olive" /> : null}
        <p className="text-xs font-bold text-charcoal/50">{label}</p>
      </div>
      <p className="mt-1 break-words font-black">{value}</p>
    </div>
  );
}

function TimelineItem({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-warm-50 text-olive">
        <Icon size={20} />
      </span>
      <span>
        <span className="block font-black">{title}</span>
        <span className="mt-1 block text-sm font-bold leading-6 text-charcoal/62">{text}</span>
      </span>
    </div>
  );
}

function TrustReviewCard({ name, city, text }: { name: string; city: string; text: string }) {
  return (
    <article className="rounded-xl border border-charcoal/10 bg-warm-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black">{name}</p>
          <p className="mt-1 text-xs font-bold text-charcoal/50">{city}</p>
        </div>
        <div className="flex text-gold" aria-label="5 stars">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={14} className="fill-gold" />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm font-bold leading-7 text-charcoal/70">"{text}"</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-olive">
        <CheckCircle2 size={14} /> تجربة عميلة
      </div>
    </article>
  );
}
