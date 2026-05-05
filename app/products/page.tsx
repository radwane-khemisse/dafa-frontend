import { ProductCard } from "@/components/product/product-card";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <>
      <section className="bg-warm-100 py-14">
        <div className="container-shell text-center">
          <p className="text-sm font-black text-date">مجموعة مطبخ دفا</p>
          <h1 className="mt-3 text-4xl font-black">أدوات صغيرة تغيّر إحساسك بالمطبخ كل يوم</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-charcoal/70">
            اختيارات عملية للمطبخ السعودي: تقطيع أسرع، مؤونة مرتبة، وحوض أنظف بعد الغسيل. واضحة في الاستخدام، مناسبة للدفع عند الاستلام، ونأكدها معك قبل الشحن.
          </p>
        </div>
      </section>
      <section className="container-shell grid gap-5 py-16 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </>
  );
}
