"use client";

import Link from "next/link";
import { ChevronDown, CookingPot, PhoneCall, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { products } from "@/data/products";

export function Footer() {
  const [hiddenProducts, setHiddenProducts] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/catalog/visibility`)
      .then((response) => (response.ok ? response.json() : null))
      .then((visibility: { hidden_products?: string[] } | null) => setHiddenProducts(visibility?.hidden_products ?? []))
      .catch(() => setHiddenProducts([]));
  }, []);

  const visibleFooterProducts = products.filter((product) => !hiddenProducts.includes(product.id));

  return (
    <footer className="border-t border-charcoal/10 bg-olive text-white">
      <div className="container-shell grid gap-6 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10 md:py-12">
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
            مطبخ دفا يختار أدوات عملية للبيت السعودي، مع عروض توفر عليك إذا تبغين أكثر من قطعة أو منتجين يكملون بعض.
          </p>
        </div>

        <FooterSection title="المنتجات">
          {visibleFooterProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="hover:text-white">
              {product.nameAr}
            </Link>
          ))}
        </FooterSection>

        <FooterSection title="روابط مهمة">
          <Link href="/about" className="hover:text-white">من نحن</Link>
          <Link href="/contact" className="hover:text-white">تواصل معنا</Link>
          <Link href="/delivery" className="hover:text-white">سياسة التوصيل</Link>
          <Link href="/returns" className="hover:text-white">الاستبدال والاسترجاع</Link>
          <Link href="/privacy" className="hover:text-white">الخصوصية</Link>
        </FooterSection>

        <FooterSection title="الثقة والطلب">
          <span className="flex items-center gap-2"><Truck size={16} /> شحن للمدن الرئيسية حسب التغطية</span>
          <span className="flex items-center gap-2"><PhoneCall size={16} /> تأكيد المنتج والكمية قبل الشحن</span>
          <span className="flex items-center gap-2"><ShieldCheck size={16} /> ضمان ذهبي 30 يوم</span>
        </FooterSection>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/55">
        جميع الحقوق محفوظة لمطبخ دفا
      </div>
    </footer>
  );
}

function FooterSection({ title, children }: { title: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateOpenState = () => setIsOpen(mediaQuery.matches);

    updateOpenState();
    mediaQuery.addEventListener("change", updateOpenState);
    return () => mediaQuery.removeEventListener("change", updateOpenState);
  }, []);

  return (
    <details className="group border-t border-white/10 pt-4 md:border-0 md:pt-0" open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-black marker:hidden">
        {title}
        <ChevronDown size={18} className="transition group-open:rotate-180 md:hidden" />
      </summary>
      <div className="mt-4 grid gap-3 text-sm text-white/70">{children}</div>
    </details>
  );
}
