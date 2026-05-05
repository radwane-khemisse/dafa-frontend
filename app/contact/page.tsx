import { Headphones, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <section className="container-shell py-14">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-black text-date">تواصل معنا</p>
          <h1 className="mt-3 text-4xl font-black">نساعدك قبل وبعد الطلب</h1>
          <p className="mt-4 leading-8 text-charcoal/70">
            للدفع عند الاستلام، سيتم تأكيد الطلب عبر اتصال هاتفي قبل الشحن. الرجاء الرد حتى لا يتأخر طلبك.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="https://wa.me/966500000000" variant="gold">
              <Headphones size={18} /> دعم العملاء
            </ButtonLink>
            <ButtonLink href="tel:+966500000000" variant="outline">
              <Phone size={18} /> اتصال
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-black">معلومات الدعم</h2>
          <div className="mt-5 grid gap-4 text-sm leading-7 text-charcoal/70">
            <p><strong className="text-charcoal">ساعات العمل:</strong> يوميا من 10 صباحا إلى 10 مساء</p>
            <p><strong className="text-charcoal">طريقة الدفع:</strong> الدفع عند الاستلام فقط</p>
            <p><strong className="text-charcoal">التأكيد:</strong> الطلبات غير المؤكدة قد لا يتم شحنها</p>
          </div>
        </div>
      </div>
    </section>
  );
}
