import { PackCard } from "@/components/pack/pack-card";
import { packs } from "@/data/packs";

export default function PacksPage() {
  return (
    <main className="bg-warm-50 py-14">
      <section className="container-shell">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-olive">باقات دفا</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            منتجات متكاملة ترفع قيمة الطلب بدون كميات مكررة
          </h1>
          <p className="mt-4 font-bold leading-8 text-charcoal/66">
            كل باقة تجمع منتجين يخدمان نفس روتين المطبخ، عشان يكون العرض مفهوم ومفيد بعد الاستلام.
          </p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>
    </main>
  );
}
