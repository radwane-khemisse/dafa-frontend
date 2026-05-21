import { PackCard } from "@/components/pack/pack-card";
import { packs } from "@/data/packs";
import { getCatalogVisibility, visiblePacks } from "@/lib/catalog-visibility";
import { notFound } from "next/navigation";

export default async function PacksPage() {
  const visibility = await getCatalogVisibility();
  if (!visibility.market.active) notFound();
  const listedPacks = visiblePacks(packs, visibility);

  return (
    <main className="bg-warm-50 py-14">
      <section className="container-shell">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-olive">باقات التوفير</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            منتجان في طلب واحد بسعر أوفر من شرائهم منفردين
          </h1>
          <p className="mt-4 font-bold leading-8 text-charcoal/66">
            كل باقة مصممة لروتين واضح في البيت: غداء أسرع، مؤونة أرتب، أو سطح مطبخ أوسع بعد الغسيل.
          </p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {listedPacks.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>
    </main>
  );
}
