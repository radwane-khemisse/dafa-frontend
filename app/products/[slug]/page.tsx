import { notFound } from "next/navigation";
import { Award, Banknote, CheckCircle2, PackageCheck, Settings2, Star, Truck } from "lucide-react";
import { OfferSelector } from "@/components/product/offer-selector";
import { ProductCard } from "@/components/product/product-card";
import { ReviewCard } from "@/components/product/review-card";
import { StickyProductCta } from "@/components/product/sticky-product-cta";
import { ProductViewTracker } from "@/components/tracking/product-view-tracker";
import { ProductVisual } from "@/components/ui/product-visual";
import { getCrossSells, getProductBySlug, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const crossSells = getCrossSells([product.id]);

  return (
    <>
      <ProductViewTracker productId={product.id} />
      <section className="bg-warm-100 pb-5 pt-10 md:pb-7 md:pt-14">
        <div className="container-shell grid items-start gap-8 lg:grid-cols-[0.9fr_1fr] lg:[direction:ltr]">
          <div className="order-2 lg:order-1 lg:col-start-1 lg:row-start-1 lg:[direction:rtl]">
            <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-date shadow-soft">
              {product.role}
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">{product.nameAr}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={18} className="fill-gold" />
                ))}
              </div>
              <span className="text-sm font-black text-charcoal">
                {product.rating} من 5
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-charcoal/65 shadow-soft">
                {product.ratingCount.toLocaleString("ar-SA")} تقييم
              </span>
            </div>
            <div id="product-offer" className="mt-6 scroll-mt-28">
              <OfferSelector product={product} />
            </div>
          </div>
          <ProductVisual product={product} ratio="square" className="order-1 lg:order-2 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-32" />
        </div>
        <div className="container-shell mt-6 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-4 md:min-w-0 md:grid md:grid-cols-3">
            {[
              [Banknote, "الدفع عند الاستلام"],
              [Truck, "شحن سريع للسعودية"],
              [Award, "ضمان ذهبي 30 يوم"],
            ].map(([Icon, text]) => (
              <div key={text as string} className="flex min-w-60 items-center gap-4 rounded-2xl border border-charcoal/10 bg-white px-5 py-4 text-base font-black text-charcoal shadow-soft md:min-w-0 md:text-lg">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-warm-100 text-olive md:h-14 md:w-14">
                  <Icon size={24} />
                </span>
                <span>{text as string}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell grid items-center gap-8 pb-12 pt-7 md:grid-cols-2 md:pt-9">
        <div>
          <p className="text-sm font-black text-olive">المشكلة اللي تحسينها كل يوم</p>
          <h2 className="mt-3 text-3xl font-black leading-tight">{product.painAr}</h2>
          <p className="mt-4 rounded-2xl bg-warm-50 p-5 text-lg font-black leading-9 text-date">{product.demoHookAr}</p>
        </div>
        <ProductVisual product={product} label="استخدام المنتج" />
      </section>

      <section className="bg-white py-14">
        <div className="container-shell grid items-center gap-8 md:grid-cols-[0.9fr_1fr]">
          <div className="order-2 md:order-1">
            <ProductVisual product={product} label="تفاصيل المنتج" ratio="wide" className="rounded-3xl" />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-sm font-black text-date">الفوائد</p>
            <h2 className="mt-3 text-3xl font-black">ليش راح تحبينه من أول أسبوع؟</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.benefits.map((benefit, index) => (
                <div key={benefit} className="relative overflow-hidden rounded-3xl border border-charcoal/10 bg-warm-50 p-4">
                  <span className="mb-4 grid h-9 w-9 place-items-center rounded-xl bg-olive text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span className="block font-bold leading-7">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="rounded-3xl bg-date p-6 text-white shadow-soft md:p-8">
          <p className="text-sm font-black text-gold">ثقة قبل التوصيل</p>
          <h2 className="mt-3 text-3xl font-black">مو مجرد إعلان، نأكد معك قبل الشحن عشان توصلك وأنت مقتنعة</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              "نشرح لك المنتج والكمية في اتصال التأكيد",
              "الدفع عند الاستلام داخل السعودية",
              "الضمان الذهبي يعطيك راحة بعد الاستلام",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-bold leading-7 text-white/85">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-warm-100 text-olive">
              <Settings2 size={22} />
            </span>
            <div>
              <p className="text-sm font-black text-date">اختيار دفا</p>
              <h2 className="text-2xl font-black">نقاط عملية قبل الطلب</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.specs.map((spec) => (
              <div key={spec} className="flex gap-3 rounded-2xl bg-warm-50 p-4 text-sm font-bold leading-7">
                <CheckCircle2 className="mt-1 shrink-0 text-olive" size={18} />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-olive p-6 text-white shadow-soft">
          <PackageCheck className="mb-5 text-gold" size={34} />
          <p className="text-sm font-black text-gold">داخل الطلب</p>
          <h2 className="mt-2 text-2xl font-black">كل شيء تحتاجينه لاستخدام المنتج</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.included.map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/85">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm font-bold leading-7 text-white/75">
            نركز على التفاصيل التي تساعدك تقررين بثقة قبل الشحن، بدون حشو زائد.
          </p>
        </div>
        </div>
      </section>

      <section className="bg-warm-100 py-14">
        <div className="container-shell">
          <h2 className="mb-6 text-center text-3xl font-black">تجارب قريبة من واقع المطبخ السعودي</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <ReviewCard name="أم نورة" city="الرياض" text="الطلب كان واضح والتأكيد عبر اتصال هاتفي ريحني." />
            <ReviewCard name="سارة" city="جدة" text={product.emotionAr} />
            <ReviewCard name="ريم" city="الدمام" text="منتج عملي وواضح استخدامه من أول مرة." />
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-8 py-14 lg:grid-cols-[0.95fr_1fr]">
        <div>
          <p className="text-sm font-black text-olive">ارفعي قيمة الطلب</p>
          <h2 className="mt-2 text-3xl font-black">أضيفي منتج مكمل مع نفس الشحنة</h2>
          <p className="mt-3 leading-8 text-charcoal/65">
            اختاري منتج ثاني من مطبخ دفا عشان تكملي نظام التحضير، التخزين، وترتيب الحوض.
          </p>
          <div className="mt-6 grid gap-4">
            {crossSells.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black">أسئلة مهمة قبل الطلب</h2>
          <div className="mt-6 grid gap-3">
            {product.faq.map((item) => (
              <details key={item.question} className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft">
                <summary className="cursor-pointer font-black">{item.question}</summary>
                <p className="mt-3 leading-7 text-charcoal/70">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <StickyProductCta product={product} />
    </>
  );
}
