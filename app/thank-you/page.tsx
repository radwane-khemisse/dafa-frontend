import Link from "next/link";
import { CheckCircle2, Clock3, PhoneCall, ShieldCheck } from "lucide-react";
import { ThankYouSummary } from "@/components/checkout/thank-you-summary";
import { getCurrentMarket } from "@/lib/market-server";
import { formatMarketPrice } from "@/lib/markets";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; total?: string }>;
}) {
  const params = await searchParams;
  const order = params.order ?? "طلبك";
  const total = params.total ?? "";
  const market = await getCurrentMarket();

  return (
    <section className="bg-warm-50">
      <div className="container-shell py-10 md:py-14">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-2xl bg-olive p-6 text-white shadow-soft md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black">
              <CheckCircle2 size={18} /> تم استلام طلبك
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">باقي مكالمة التأكيد ونبدأ تجهيز طلبك</h1>
            <p className="mt-4 max-w-2xl text-lg font-bold leading-9 text-white/82">
              لأن الطلب بالدفع عند الاستلام، نحتاج مكالمة قصيرة لتأكيد المنتجات والكمية والعنوان. الرد على المكالمة هو أسرع طريقة لتجهيز طلبك بدون تأخير.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-4">
                <Clock3 size={22} className="mb-3 text-gold" />
                <p className="font-black">من 9 صباحا إلى 9 مساء</p>
                <p className="mt-1 text-sm leading-6 text-white/72">داخل أوقات العمل نحاول الاتصال خلال أقل من 10 دقائق.</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <ShieldCheck size={22} className="mb-3 text-gold" />
                <p className="font-black">بدون دفع الآن</p>
                <p className="mt-1 text-sm leading-6 text-white/72">الدفع يكون عند الاستلام بعد تأكيد الطلب وتجهيزه للشحن.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft md:p-6">
            <p className="text-sm font-black text-olive">رقم الطلب</p>
            <p className="mt-1 text-2xl font-black">{order}</p>
            {total ? (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FFF7E4] px-4 py-3">
                <span className="font-black text-date">المبلغ عند الاستلام</span>
                <span className="text-2xl font-black text-charcoal">{formatMarketPrice(total, market)}</span>
              </div>
            ) : null}
            <div className="mt-4 rounded-xl border border-gold/35 bg-warm-50 p-4">
              <p className="font-black text-date">قد يظهر رقم غير محفوظ</p>
              <p className="mt-2 text-sm font-bold leading-7 text-charcoal/68">
                المكالمة قد تأتي من رقم خدمة عملاء غير محفوظ باسم مطبخ دفا. الرد عليها يساعدنا نثبت العنوان ونرسل الطلب بسرعة.
              </p>
            </div>
            
          </div>
        </div>

        <ThankYouSummary fallbackOrderId={order} fallbackTotal={total} />
      </div>
    </section>
  );
}
