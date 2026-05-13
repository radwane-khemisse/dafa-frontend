import { notFound } from "next/navigation";
import { ArrowLeft, Banknote, CheckCircle2, PackageCheck, PhoneCall, Sparkles, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AddPackButton } from "@/components/pack/pack-actions";
import { ProductCard } from "@/components/product/product-card";
import { packImages } from "@/components/ui/product-visual";
import { getPackBySlug, getPackProducts } from "@/data/packs";
import { getCatalogVisibility } from "@/lib/catalog-visibility";

export const dynamic = "force-dynamic";

export default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pack = getPackBySlug(slug);
  if (!pack) notFound();
  const visibility = await getCatalogVisibility();
  if (visibility.hidden_packs.includes(pack.id) || pack.productIds.some((productId) => visibility.hidden_products.includes(productId))) notFound();
  const products = getPackProducts(pack);
  const saving = pack.compareAtPrice - pack.price;

  return (
    <main className="bg-warm-50">
      <section className="bg-olive py-12 text-white md:py-16">
        <div className="container-shell grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-gold">
              {pack.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">{pack.nameAr}</h1>
            <p className="mt-3 text-lg font-black text-white/88">{pack.subtitleAr}</p>
            <p className="mt-4 max-w-2xl font-bold leading-8 text-white/74">{pack.descriptionAr}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {pack.useCases.map((item) => (
                <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white/85">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative aspect-[8/5] overflow-hidden rounded-3xl border border-white/12 bg-white/8 shadow-soft">
            <Image
              src={packImages[pack.id]}
              alt={pack.nameAr}
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-shell -mt-8 grid gap-5 pb-14 lg:grid-cols-[1fr_0.78fr]">
        <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-black text-date">ليش الباقة أوفر؟</p>
          <h2 className="mt-2 text-3xl font-black">منتجان تستخدمينهم في نفس الروتين، بسعر أقل</h2>
          <div className="mt-6 grid gap-3">
            {pack.benefits.map((benefit) => (
              <p key={benefit} className="flex gap-3 rounded-2xl bg-warm-50 p-4 text-sm font-bold leading-7 text-charcoal/70">
                <CheckCircle2 className="mt-1 shrink-0 text-olive" size={18} />
                {benefit}
              </p>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl bg-date p-6 text-white shadow-soft lg:sticky lg:top-28 lg:self-start">
          <PackageCheck className="text-gold" size={34} />
          <p className="mt-4 text-sm font-black text-gold">عرض الباقة</p>
          <div className="mt-2 flex items-end gap-3">
            <p className="text-4xl font-black">{pack.price} ريال</p>
            <p className="pb-1 text-sm font-bold text-white/45 line-through">{pack.compareAtPrice} ريال</p>
          </div>
          <p className="mt-3 rounded-2xl bg-white/10 p-4 text-sm font-black leading-7 text-white/82">
            توفرين {saving} ريال وتستلمين المنتجين في نفس الطلب بدل طلبين منفصلين.
          </p>
          <AddPackButton pack={pack} className="mt-5 w-full" />
          <div className="mt-5 grid gap-3 text-sm font-bold text-white/76">
            {[
              [Banknote, "الدفع عند الاستلام"],
              [PhoneCall, "اتصال تأكيد قبل الشحن"],
              [Truck, "تستلمين المنتجين في نفس الشحنة"],
            ].map(([Icon, text]) => (
              <p key={text as string} className="flex items-center gap-2">
                <Icon size={17} className="text-gold" />
                {text as string}
              </p>
            ))}
          </div>
        </aside>
      </section>

      <section className="container-shell pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black text-olive">داخل الباقة</p>
            <h2 className="mt-1 text-3xl font-black">المنتجات المشمولة</h2>
          </div>
          <Link href="/products" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black">
            عرض كل المنتجات
            <ArrowLeft size={16} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-shell pb-16">
        <div className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-warm-100 text-olive">
              <Sparkles size={22} />
            </span>
            <div>
              <p className="text-sm font-black text-date">اختيار أذكى للبيت</p>
              <h2 className="mt-1 text-2xl font-black">الباقات روتين كامل بسعر أوفر</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-charcoal/64">
                بدل ما تطلبين منتج اليوم وترجعين تطلبين المكمل بعد أسبوع، خذي الاثنين مع بعض ووفري في السعر والتأكيد والشحنة.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
