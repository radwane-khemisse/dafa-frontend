import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="container-shell py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black text-date">من نحن</p>
        <h1 className="mt-3 text-4xl font-black">مطبخ دفا يختار الأدوات اللي فعلا تنفع البيت السعودي</h1>
        <p className="mt-5 leading-9 text-charcoal/70">
          مطبخ دفا مو متجر أدوات عشوائية. هو بيت اختيار لأدوات المطبخ اليومية: نبحث عن المشكلة، نشوف هل المنتج مفهوم وعملي، ثم نقدمه بطريقة واضحة تناسب قرار الشراء بالدفع عند الاستلام.
          نركز على البيت السعودي: تحضير أسرع، دولاب مؤونة أرتب، وحوض أنظف بعد الغسيل.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {["نختار المشكلة قبل المنتج", "نشرح الفائدة بلغة البيت", "نؤكد الطلب باتصال قبل الشحن"].map((item) => (
          <div key={item} className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-soft">
            <CheckCircle2 className="mb-4 text-olive" />
            <h2 className="text-xl font-black">{item}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}
