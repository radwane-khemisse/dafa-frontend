import { ArrowLeft, Banknote, CheckCircle2, ClipboardCheck, PhoneCall, Ruler, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ReviewCard } from "@/components/product/review-card";
import { ButtonLink } from "@/components/ui/button";
import { KitchenHeroVisual } from "@/components/ui/product-visual";
import { products } from "@/data/products";
import { applyOfferPrices, getCatalogVisibility, visibleProducts } from "@/lib/catalog-visibility";
import { notFound } from "next/navigation";

export default async function HomePage() {
  const visibility = await getCatalogVisibility();
  if (!visibility.market.active) notFound();
  const marketProducts = applyOfferPrices(products, visibility);
  const listedProducts = visibleProducts(marketProducts, visibility);

  return (
    <>
      <section className="bg-warm-100 py-8 sm:py-12 md:py-20">
        <div className="container-shell grid items-center gap-7 md:grid-cols-[1fr_0.9fr] md:gap-10">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-date shadow-soft">
              أدوات مطبخ عملية للطبخ اليومي في البيت السعودي
            </p>
            <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
              جهزي مطبخك بأدوات تقلل الفوضى وتوفر عليك وقت التحضير
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-charcoal/70 sm:mt-5 sm:text-lg sm:leading-9">
              اختاري منتجات تخدم روتينك فعلا: سلطة وكشنة أسرع، مؤونة أرتب، ورخام أوسع بعد الغسيل. وكل طلب نؤكده معك قبل الشحن.
            </p>
            <div className="mt-5 grid gap-3 text-sm font-black sm:mt-6 sm:grid-cols-3">
              {[
                [Banknote, "الدفع عند الاستلام"],
                [PhoneCall, "اتصال تأكيد قبل الشحن"],
                [ShieldCheck, "ضمان ذهبي 30 يوم"],
              ].map(([Icon, item]) => (
                <div key={item as string} className="group relative overflow-hidden rounded-2xl border border-charcoal/10 bg-white p-4 shadow-soft">
                  <div className="absolute inset-y-0 right-0 w-1 bg-gold" />
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-olive text-gold transition group-hover:scale-105">
                      <Icon size={19} />
                    </span>
                    <span>{item as string}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <ButtonLink href="/products" variant="gold">
                شوفي العروض
                <ArrowLeft size={18} />
              </ButtonLink>
            </div>
          </div>
          <KitchenHeroVisual />
        </div>
      </section>

     

      <section className="bg-white py-16">
        <div className="container-shell">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
          <p className="text-sm font-black text-date">الأكثر مناسبة للطلب الأول</p>
          <h2 className="mt-2 text-3xl font-black">ابدئي بمنتج يحل مشكلة تشوفينها كل يوم</h2>
            </div>
            <ButtonLink href="/products" variant="outline">عرض كل المنتجات</ButtonLink>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {listedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

       <section className="container-shell py-16">
        <div className="mb-8 text-center">
          <p className="text-sm font-black text-olive">ليش هذه المنتجات؟</p>
          <h2 className="mt-2 text-3xl font-black">لأنها تحل لحظات مزعجة تتكرر في أغلب مطابخنا</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["التقطيع يأخذ وقت", "كل يوم سلطة، كشنة، شوربة أو خضار. اختصار التحضير يعني وقت أقل وفوضى أقل."],
            ["أكياس الأرز والحبوب تسبب فوضى", "الأرز والعدس والبرغل من أساسيات البيت. ترتيبها يعطيك دولاب أهدأ وأنظف."],
            ["الصحون تزحم سطح المطبخ", "بعد الغسيل، الرخام يصير منطقة تجفيف. المنظم يرجع المساحة للحوض بدل السطح."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-soft">
              <CheckCircle2 className="mb-4 text-olive" />
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-charcoal/65">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell grid items-center gap-8 py-16 md:grid-cols-2">
        <div className="rounded-2xl bg-olive p-8 text-white">
          <p className="text-sm font-black text-gold">طلب مريح وواضح</p>
          <h2 className="mt-3 text-3xl font-black leading-tight">اختاري المنتج، خذي العرض الأنسب، وادفعي عند الاستلام</h2>
          <p className="mt-4 leading-8 text-white/75">
            نوضح لك الفائدة والسعر والمحتويات قبل الشحن. وإذا اخترتِ كمية أكثر، يكون السبب توفير واستخدام واضح يناسب بيتك.
          </p>
        </div>
        <div className="grid gap-4">
          {[
            [Sparkles, "فائدة واضحة", "كل منتج مربوط بلحظة استخدام: تحضير، تخزين، أو تجفيف."],
            [Wrench, "سهل يدخل الروتين", "ما يحتاج شرح طويل ولا تركيب معقد عشان تستفيدين منه."],
            [Ruler, "عرض يستاهل", "نبرز القطعتين والثلاث لأن التوفير واضح إذا يناسب بيتك."],
            [ClipboardCheck, "تأكيد قبل الشحن", "نراجع المنتج والكمية والعنوان قبل تجهيز الطلب."],
          ].map(([Icon, title, body]) => (
            <div key={title as string} className="relative overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-5 shadow-soft">
              <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-gold/15" />
              <div className="relative flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-warm-100 text-olive">
                  <Icon size={22} />
                </span>
                <span>
                  <span className="block font-black">{title as string}</span>
                  <span className="mt-1 block text-sm font-bold leading-7 text-charcoal/60">{body as string}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-warm-100 py-16">
        <div className="container-shell">
          <div className="mb-8 text-center">
            <p className="text-sm font-black text-olive">تجارب عميلات</p>
            <h2 className="mt-2 text-3xl font-black">كلام قريب من واقع المطبخ السعودي</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <ReviewCard name="أم نورة" city="الرياض" text="منظم الصحون خلى سطح المطبخ أوسع. بعد الغسيل صار كل شيء فوق الحوض بدل الرخام." />
            <ReviewCard name="سارة" city="جدة" text="حافظة الأرز والحبوب رتبت الدولاب. حتى العدس والبرغل صار لهم مكان واضح." />
            <ReviewCard name="ريم" city="الدمام" text="القطاعة صارت أكثر شيء أستخدمه وقت السلطة والكشنة. تخلصين أسرع وتنظفين أقل." />
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="rounded-3xl bg-charcoal p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-black">ابدئي بالعرض اللي يناسب بيتك اليوم</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/70">
            شوفي المنتج، قارني التوفير، واختاري قطعة واحدة أو عرض القطعتين والثلاث حسب احتياج البيت.
          </p>
          <ButtonLink href="/products" variant="gold" className="mt-7">اختاري العرض المناسب</ButtonLink>
        </div>
      </section>
    </>
  );
}
