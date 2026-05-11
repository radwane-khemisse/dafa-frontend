import { CheckCircle2, Clock, CreditCard, Mail } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function ContactPage() {
  const supportItems = [
    {
      icon: Clock,
      label: "ساعات العمل",
      text: "يوميا من 10 صباحا إلى 10 مساء",
    },
    {
      icon: CreditCard,
      label: "طريقة الدفع",
      text: "الدفع عند الاستلام فقط داخل السعودية",
    },
    {
      icon: CheckCircle2,
      label: "التأكيد",
      text: "الطلبات غير المؤكدة قد لا يتم شحنها، لذلك نراجع التفاصيل قبل التجهيز",
    },
  ];

  return (
    <section className="container-shell py-14">
      <div className="grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-black text-date">تواصل معنا</p>
          <h1 className="mt-3 text-4xl font-black">عندك سؤال قبل تختارين العرض؟</h1>
          <p className="mt-4 leading-8 text-charcoal/70">
            إذا تبغين تعرفين هل يناسبك منتج واحد، عرض القطعتين، أو الباقة، راسلينا. ونؤكد كل طلب قبل الشحن عشان توصل الشحنة ببيانات واضحة.
          </p>
          <div className="mt-7">
            <ButtonLink href="mailto:support@dafakitchen.shop" variant="gold">
              <Mail size={18} /> support@dafakitchen.shop
            </ButtonLink>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-soft">
          <div className="bg-olive p-6 text-white">
            <p className="text-sm font-black text-gold">معلومات الدعم</p>
            <h2 className="mt-2 text-2xl font-black">مساعدة واضحة قبل ما نجهز الطلب</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-white/75">
              نساعدك في أسئلة المنتجات، اختيار العرض المناسب، طلبات الدفع عند الاستلام، وتأكيد بيانات الطلب قبل الشحن.
            </p>
          </div>
          <div className="grid gap-3 bg-warm-50 p-5">
            {supportItems.map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex gap-4 rounded-2xl border border-charcoal/10 bg-white p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-warm-100 text-olive">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-black text-charcoal">{label}</p>
                  <p className="mt-1 text-sm font-bold leading-7 text-charcoal/65">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
