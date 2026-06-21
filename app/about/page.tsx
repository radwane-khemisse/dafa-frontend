import { CheckCircle2, ClipboardCheck, Home, PackageCheck, PhoneCall, Sparkles } from "lucide-react";

export default function AboutPage() {
  const standards = [
    {
      icon: ClipboardCheck,
      title: "نختار حسب الاستخدام اليومي",
      text: "كل أداة لازم تخدم لحظة واضحة: سلطة وكشنة، مؤونة، أو صحون بعد الغسيل.",
    },
    {
      icon: Home,
      title: "نوضح متى تكفيك قطعة ومتى يفيدك العرض",
      text: "إذا يناسبك منتج واحد نقولها، وإذا عرض القطعتين أوفر لبيتك نوضح السبب.",
    },
    {
      icon: PhoneCall,
      title: "نؤكد الطلب قبل الشحن",
      text: "لأن الدفع عند الاستلام يحتاج طلب جاد وبيانات واضحة، نراجع التفاصيل قبل تجهيز الشحنة.",
    },
  ];

  return (
    <main className="bg-warm-50">
      <section className="bg-olive py-14 text-white">
        <div className="container-shell grid items-center gap-8 md:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="text-sm font-black text-gold">من نحن</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
            مطبخ دفا يختار أدوات تخفف شغل المطبخ اليومي في البيت السعودي
            </h1>
            <p className="mt-5 max-w-2xl font-bold leading-8 text-white/76">
              نركز على منتجات واضحة الاستخدام وتدخل الروتين بسرعة: تحضير أسرع، مؤونة أرتب، ورخام أوسع. والعروض عندنا مبنية على توفير حقيقي، مو زيادة بلا سبب.
            </p>
          </div>
          <div className="rounded-3xl border border-white/12 bg-white/8 p-5">
            <div className="rounded-2xl bg-warm-50 p-5 text-charcoal">
              <Sparkles className="text-gold" size={32} />
              <h2 className="mt-4 text-2xl font-black">معيار دفا</h2>
              <div className="mt-4 grid gap-3 text-sm font-bold leading-7 text-charcoal/68">
                {["يحل مشكلة يومية واضحة", "له عرض توفير منطقي", "نؤكده قبل الشحن"].map((item) => (
                  <p key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-1 shrink-0 text-olive" size={17} />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell -mt-8 grid gap-4 pb-14 md:grid-cols-3">
        {standards.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-warm-100 text-olive">
              <Icon size={22} />
            </span>
            <h2 className="mt-5 text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-charcoal/64">{text}</p>
          </article>
        ))}
      </section>

      <section className="container-shell pb-14">
        <div className="grid gap-5 rounded-3xl bg-date p-6 text-white shadow-soft md:grid-cols-[auto_1fr] md:items-center md:p-8">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gold text-charcoal">
            <PackageCheck size={30} />
          </span>
          <div>
            <p className="text-sm font-black text-gold">وعدنا البسيط</p>
            <h2 className="mt-1 text-2xl font-black">نساعدك تختارين طلب مفيد، مو قطعة تزيد الزحمة</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-white/72">
              لذلك تلاحظين في مطبخ دفا لغة واضحة، منتجات قليلة ومنتقاة، وعروض تشجعك توفرين فقط إذا كانت مناسبة لروتين بيتك.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
