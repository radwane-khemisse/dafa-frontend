import Link from "next/link";
import { CheckCircle2, Clock3, PhoneCall, ShieldCheck } from "lucide-react";
import { ThankYouSummary } from "@/components/checkout/thank-you-summary";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; total?: string }>;
}) {
  const params = await searchParams;
  const order = params.order ?? "طلبك";
  const total = params.total ?? "";

  return (
    <section className="bg-warm-50">
      <div className="container-shell py-10 md:py-14">
        <div className="grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl bg-olive p-6 text-white shadow-soft md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black">
              <CheckCircle2 size={18} /> تم استلام طلبك
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">باقي خطوة واحدة عشان نجهز الشحنة</h1>
            <p className="mt-4 max-w-xl text-lg font-bold leading-9 text-white/82">
              طلبات الدفع عند الاستلام لا تنشحن إلا بعد مكالمة تأكيد قصيرة. جهزي الجوال، لأننا بنتصل عليك للتأكد من العنوان قبل تجهيز الطلب.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-4">
                <Clock3 size={22} className="mb-3 text-gold" />
                <p className="font-black">الاتصال من 9 صباحا إلى 9 مساء</p>
                <p className="mt-1 text-sm leading-6 text-white/72">داخل أوقات العمل نحاول الاتصال خلال أقل من 10 دقائق.</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <ShieldCheck size={22} className="mb-3 text-gold" />
                <p className="font-black">لا يوجد دفع الآن</p>
                <p className="mt-1 text-sm leading-6 text-white/72">تدفعين عند الاستلام بعد ما يتم تأكيد الطلب والشحن.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft md:p-6">
            <p className="text-sm font-black text-olive">رقم الطلب</p>
            <p className="mt-1 text-2xl font-black">{order}</p>
            {total ? (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FFF7E4] px-4 py-3">
                <span className="font-black text-date">المبلغ عند الاستلام</span>
                <span className="text-2xl font-black text-charcoal">{total} ريال</span>
              </div>
            ) : null}
            <div className="mt-4 rounded-xl border border-gold/35 bg-warm-50 p-4">
              <p className="font-black text-date">مهم جدا للتأكيد</p>
              <p className="mt-2 text-sm font-bold leading-7 text-charcoal/68">
                ممكن يظهر لك رقم غير محفوظ باسم مطبخ دفا. ردي على المكالمة عشان نثبت العنوان ونرسل الطلب بدون تأخير.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              
              <Link
                className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-charcoal/15 px-5 py-3 text-sm font-black"
                href="/products"
              >
                تصفح المنتجات
              </Link>
            </div>
          </div>
        </div>

        <ThankYouSummary fallbackOrderId={order} fallbackTotal={total} />
      </div>
    </section>
  );
}
