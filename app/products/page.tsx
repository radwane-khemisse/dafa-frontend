import { ProductCard } from "@/components/product/product-card";
import { products } from "@/data/products";
import { getCatalogVisibility, visibleProducts } from "@/lib/catalog-visibility";
import { notFound } from "next/navigation";

export default async function ProductsPage() {
  const visibility = await getCatalogVisibility();
  if (!visibility.market.active) notFound();
  const listedProducts = visibleProducts(products, visibility);

  return (
    <>
      <section className="bg-warm-100 py-14">
        <div className="container-shell text-center">
          <p className="text-sm font-black text-date">منتجات مطبخ دفا</p>
          <h1 className="mt-3 text-4xl font-black">اختاري منتج يحل مشكلة يومية، أو عرض يوفر عليك أكثر</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-charcoal/70">
            تقطيع أسرع، مؤونة مرتبة، ورخام أوسع بعد الغسيل. تقدرين تاخذين قطعة واحدة للتجربة أو عرض القطعتين والثلاث إذا يناسب البيت أو الهدية.
          </p>
        </div>
      </section>
      <section className="container-shell grid gap-5 py-16 lg:grid-cols-3">
        {listedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </>
  );
}
