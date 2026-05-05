import Link from "next/link";
import { CookingPot, PhoneCall, ShieldCheck, Truck } from "lucide-react";
import { products } from "@/data/products";

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-olive text-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-charcoal">
              <CookingPot size={26} />
            </span>
            <div>
              <p className="text-xl font-black">مطبخ دفا</p>
              <p className="brand-latin text-xs text-white/60">Dafa Kitchen</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
            مطبخ دفا بيت اختيار أدوات المطبخ العملية للبيت السعودي. نختار أدوات تحل مشكلة يومية واضحة، ونأكد الطلب باتصال قبل الشحن.
          </p>
        </div>

        <div>
          <h3 className="font-black">المنتجات</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="hover:text-white">
                {product.nameAr}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black">روابط مهمة</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/about" className="hover:text-white">من نحن</Link>
            <Link href="/contact" className="hover:text-white">تواصل معنا</Link>
            <Link href="/delivery" className="hover:text-white">سياسة التوصيل</Link>
            <Link href="/returns" className="hover:text-white">الاستبدال والاسترجاع</Link>
            <Link href="/privacy" className="hover:text-white">الخصوصية</Link>
          </div>
        </div>

        <div>
          <h3 className="font-black">الثقة والطلب</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <span className="flex items-center gap-2"><Truck size={16} /> شحن سريع للمدن الرئيسية</span>
            <span className="flex items-center gap-2"><PhoneCall size={16} /> تأكيد عبر اتصال هاتفي</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} /> ضمان ذهبي 30 يوم</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">dafakitchen.shop</div>
    </footer>
  );
}
