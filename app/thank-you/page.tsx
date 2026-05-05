import Link from "next/link";
import { CheckCircle2, PhoneCall } from "lucide-react";
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
    <section className="container-shell py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-charcoal/10 bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto text-olive" size={64} />
        <h1 className="mt-5 text-4xl font-black">تم استلام طلبك بنجاح</h1>
        <p className="mt-4 leading-8 text-charcoal/70">
          فريق مطبخ دفا بيتواصل معك باتصال هاتفي لتأكيد الطلب قبل الشحن. الرجاء إبقاء الجوال قريب حتى ما يتأخر طلبك.
        </p>
        <div className="mt-6 rounded-2xl bg-warm-50 p-5 text-start">
          <p className="font-black">رقم الطلب: {order}</p>
          {total ? <p className="mt-2 font-black">المبلغ عند الاستلام: {total} ريال</p> : null}
          <p className="mt-2 text-sm text-charcoal/65">الحالة: بانتظار التأكيد</p>
        </div>
        <ThankYouSummary />
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg bg-gold px-5 py-3 font-bold text-charcoal" href="/">
            العودة للرئيسية
          </Link>
          <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-charcoal/15 px-5 py-3 font-bold" href="https://wa.me/966500000000">
            <PhoneCall size={18} /> اتصال
          </Link>
        </div>
      </div>
    </section>
  );
}
