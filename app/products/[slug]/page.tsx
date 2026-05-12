import { notFound } from "next/navigation";
import { Award, Banknote, CheckCircle2, ClipboardCheck, PackageCheck, PhoneCall, ShieldCheck, Sparkles, Star, Timer, Truck } from "lucide-react";
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

const shippingPaymentFaq = [
  {
    question: "هل الدفع عند الاستلام؟",
    answer: "نعم، كل طلبات مطبخ دفا داخل السعودية بالدفع عند الاستلام. نؤكد الطلب معك قبل الشحن حتى تكون البيانات والكمية واضحة.",
  },
  {
    question: "هل الشحن مجاني؟",
    answer: "نعم، الشحن المجاني متاح ضمن العرض الحالي للطلبات المؤكدة قبل الشحن.",
  },
  {
    question: "متى يبدأ تجهيز الطلب؟",
    answer: "بعد إرسال الطلب، نتواصل معك لتأكيد الاسم والمدينة والعنوان والكمية. بعد التأكيد يبدأ تجهيز الشحنة حسب تغطية شركة الشحن.",
  },
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const crossSells = getCrossSells([product.id]);
  const productFaq = product.faq.filter((item) => !item.question.includes("الدفع"));

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
            <p className="mt-4 max-w-2xl text-base font-bold leading-8 text-charcoal/70 md:text-lg">
              {product.subheadingAr}
            </p>
            
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
            <div className="mt-4 inline-flex max-w-fit items-center gap-2 rounded-xl border border-red-700/20 bg-red-50 px-3 py-2 text-xs font-black text-red-800 shadow-soft md:text-sm">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-700 text-white">
                <Timer size={17} />
              </span>
                            <span>آخر ٤٨ ساعة على عرض الشحن المجاني هذا الأسبوع</span>

            </div>
            <div id="product-offer" className="mt-6 scroll-mt-28">
              <OfferSelector product={product} />
            </div>
          </div>
          <ProductVisual product={product} ratio="square" variant="hero" priority className="order-1 lg:order-2 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-32" />
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
        <ProductVisual product={product} label="استخدام المنتج" variant="usage" />
      </section>

      <section className="bg-white py-14">
        <div className="container-shell grid items-center gap-8 md:grid-cols-[0.9fr_1fr]">
          <div className="order-2 md:order-1">
            <ProductVisual product={product} label="تفاصيل المنتج" ratio="wide" variant="benefits" className="rounded-3xl" />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-sm font-black text-date">الفائدة اليومية</p>
            <h2 className="mt-3 text-3xl font-black">وش الفرق اللي تحسينه من أول استخدامات؟</h2>
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

      <section className="bg-date py-14 text-white">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-gold">طلب بدون دفع مسبق</p>
            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">نراجع العرض والكمية قبل ما يتحرك الطلب</h2>
            <p className="mt-4 font-bold leading-8 text-white/72">
              خصوصا مع عروض القطعتين والثلاث، نؤكد معك الكمية والمبلغ والعنوان حتى تستلمين طلب واضح بدون لخبطة.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              [PhoneCall, "مكالمة قصيرة", "نراجع المنتج والعرض والكمية قبل تجهيز الشحنة."],
              [Banknote, "الدفع عند الاستلام", "تدفعين بعد وصول الطلب، بدون دفع مسبق."],
              [ShieldCheck, "راحة بعد الاستلام", "ضمان ذهبي 30 يوم حسب سياسة الاستبدال."],
            ].map(([Icon, title, text], index) => (
              <div key={title as string} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5">
                <span className="absolute left-4 top-4 text-5xl font-black leading-none text-white/8">{index + 1}</span>
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gold text-charcoal">
                  <Icon size={22} />
                </span>
                <h3 className="relative mt-5 text-lg font-black">{title as string}</h3>
                <p className="relative mt-2 text-sm font-bold leading-7 text-white/72">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm-100 py-14">
        <div className="container-shell">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-black text-olive">قبل ما تختارين العرض</p>
            <h2 className="mt-2 text-3xl font-black leading-tight">تفاصيل تساعدك تعرفين إذا يناسب روتين بيتك</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
            <div className="grid gap-3 sm:grid-cols-2">
              {product.specs.map((spec, index) => (
                <div key={spec} className="relative overflow-hidden rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft">
                  <span className="absolute -left-2 -top-2 text-6xl font-black leading-none text-warm-100">{index + 1}</span>
                  <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-olive text-white">
                    <ClipboardCheck size={20} />
                  </span>
                  <p className="relative mt-4 text-sm font-bold leading-7 text-charcoal/72">{spec}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-olive p-6 text-white shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-gold">داخل الطلب</p>
                  <h2 className="mt-2 text-2xl font-black leading-tight">محتويات واضحة من أول اتصال</h2>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold">
                  <PackageCheck size={25} />
                </span>
              </div>
              <div className="mt-6 grid gap-3">
                {product.included.map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold text-charcoal">
                      <CheckCircle2 size={17} />
                    </span>
                    <span className="font-black text-white/88">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <Sparkles className="text-gold" size={20} />
                <p className="mt-2 text-sm font-bold leading-7 text-white/72">
                  نختصر عليك القرار: تعرفين وش يجيك، وين تستخدمينه، وهل الأفضل لك قطعة واحدة أو عرض التوفير.
                </p>
              </div>
            </div>
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
          <p className="text-sm font-black text-olive">كملي روتين المطبخ</p>
          <h2 className="mt-2 text-3xl font-black">منتج ثاني يخدم نفس الطلب ويوصل معاه</h2>
          <p className="mt-3 leading-8 text-charcoal/65">
            إذا بتطلبين الآن، شوفي المنتج المكمل بدل ما تطلبينه لاحقا بشحنة ثانية.
          </p>
          <div className="mt-6 grid gap-4">
            {crossSells.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black">أسئلة مهمة قبل الطلب</h2>
          <div className="mt-6 grid gap-6">
            <FaqGroup title="عن المنتج" items={productFaq} />
            <FaqGroup title="الشحن والدفع" items={shippingPaymentFaq} />
          </div>
        </div>
      </section>

      <StickyProductCta product={product} />
    </>
  );
}

function FaqGroup({ title, items }: { title: string; items: { question: string; answer: string }[] }) {
  return (
    <div className="rounded-3xl border border-charcoal/10 bg-white p-4 shadow-soft">
      <h3 className="mb-3 rounded-2xl bg-warm-50 px-4 py-3 text-lg font-black text-date">{title}</h3>
      <div className="grid gap-3">
        {items.map((item) => (
          <details key={item.question} className="rounded-2xl border border-charcoal/10 bg-white p-5">
            <summary className="cursor-pointer font-black">{item.question}</summary>
            <p className="mt-3 leading-7 text-charcoal/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
