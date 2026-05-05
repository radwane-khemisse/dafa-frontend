import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ReviewCard } from "@/components/product/review-card";
import { ButtonLink } from "@/components/ui/button";
import { KitchenHeroVisual } from "@/components/ui/product-visual";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <section className="bg-warm-100 py-14 md:py-20">
        <div className="container-shell grid items-center gap-10 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-date shadow-soft">
              بيت اختيار أدوات المطبخ العملية للبيت السعودي
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              مطبخ دفا يختار لك الأدوات اللي تستاهل تدخل مطبخك
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-charcoal/70">
              مو كل أداة منتشرة تستاهل الشراء. نختار أدوات يومية واضحة للبيت السعودي: تجهز أسرع، ترتب الدولاب، وتخلي الحوض والسطح أهدأ بعد الغسيل.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-black sm:grid-cols-3">
              {["COD داخل السعودية", "اتصال تأكيد قبل الشحن", "ضمان ذهبي 30 يوم"].map((item) => (
                <div key={item} className="rounded-xl bg-white px-4 py-3 text-center shadow-soft">{item}</div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/products" variant="gold">
                تسوقي الآن
                <ArrowLeft size={18} />
              </ButtonLink>
              <ButtonLink href="/about" variant="outline">لماذا مطبخ دفا؟</ButtonLink>
            </div>
          </div>
          <KitchenHeroVisual />
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-8 text-center">
          <p className="text-sm font-black text-olive">معيار مطبخ دفا</p>
          <h2 className="mt-2 text-3xl font-black">نختار المنتج إذا كانت فائدته واضحة قبل ما يوصلك</h2>
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

      <section className="bg-white py-16">
        <div className="container-shell">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
          <p className="text-sm font-black text-date">اختيارات دفا</p>
          <h2 className="mt-2 text-3xl font-black">أدوات مختارة بعقلية مطبخ، مو بعقلية ترند</h2>
            </div>
            <ButtonLink href="/products" variant="outline">عرض كل المنتجات</ButtonLink>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell grid items-center gap-8 py-16 md:grid-cols-2">
        <div className="rounded-2xl bg-olive p-8 text-white">
          <p className="text-sm font-black text-gold">هوية مطبخ دفا</p>
          <h2 className="mt-3 text-3xl font-black leading-tight">نبيع الثقة قبل الأداة: اختيار واضح، استخدام يومي، وطلب مؤكد</h2>
          <p className="mt-4 leading-8 text-white/75">
            لأن الشراء بالدفع عند الاستلام يحتاج قناعة حقيقية، نختار أدوات تشوفين فائدتها من أول نظرة وتبقين محتاجتها بعد ما تهدأ رغبة الشراء.
          </p>
        </div>
        <div className="grid gap-4">
          {["مشكلة يومية في المطبخ", "استخدام مفهوم بدون شرح طويل", "مقاس وفائدة واضحين قبل الطلب", "COD، اتصال تأكيد، وضمان ذهبي"].map((item) => (
            <div key={item} className="rounded-2xl border border-charcoal/10 bg-white p-5 font-black shadow-soft">
              {item}
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
          <h2 className="text-3xl font-black">اختاري أداة تدخل مطبخك بثقة</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/70">
            شوفي المنتج، اختاري العرض، ونكلمك قبل الشحن للتأكيد. إذا ما كان واضح لك، ما نشحنه.
          </p>
          <ButtonLink href="/products" variant="gold" className="mt-7">اختاري منتجك</ButtonLink>
        </div>
      </section>
    </>
  );
}
