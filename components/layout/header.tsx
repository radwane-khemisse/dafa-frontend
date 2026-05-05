"use client";

import Link from "next/link";
import { Menu, ShoppingCart, X, CookingPot } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openCart, items } = useCartStore();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-warm-50/95 backdrop-blur">
      <div className="container-shell flex min-h-20 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive text-gold">
            <CookingPot size={26} />
          </span>
          <span>
            <span className="block text-xl font-black leading-6">مطبخ دفا</span>
            <span className="brand-latin block  text-xs font-semibold uppercase text-charcoal/60">Dafa Kitchen</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-date">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            className="focus-ring relative flex h-11 w-11 items-center justify-center rounded-lg border border-charcoal/10 bg-white"
            aria-label="فتح السلة"
          >
            <ShoppingCart size={20} />
            {count > 0 ? (
              <span className="absolute -left-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1 text-xs font-black">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-lg border border-charcoal/10 bg-white md:hidden"
            aria-label="فتح القائمة"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="container-shell grid gap-2 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg bg-white px-4 py-3 text-sm font-bold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
