"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { gulfMarkets, marketCodes, prefixMarketHref, switchMarketHref } from "@/lib/markets";
import { useCurrentMarket } from "@/lib/market-client";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/packs", label: "الباقات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openCart, items } = useCartStore();
  const market = useCurrentMarket();
  const pathname = usePathname();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const pathSegments = pathname.split("/").filter(Boolean);
  const isMarketHome = pathSegments.length === 0 || (pathSegments.length === 1 && marketCodes.includes(pathSegments[0] as (typeof marketCodes)[number]));
  const isAdminRoute = pathSegments[0] === "admin" || (marketCodes.includes(pathSegments[0] as (typeof marketCodes)[number]) && pathSegments[1] === "admin");
  const showMarketSwitcher = !isMarketHome && !isAdminRoute;

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-warm-50/95 backdrop-blur">
      <div className="container-shell flex min-h-20 items-center justify-between gap-4 py-3">
        <Link href={prefixMarketHref("/", market)} className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-olive">
            <img src="/brand-mark-light.png?v=pro" alt="" width={48} height={48} className="h-12 w-12 object-contain" />
          </span>
          <span>
            <span className="block text-xl font-black leading-6">مطبخ دفا</span>
            <span className="brand-latin block  text-xs font-semibold uppercase text-charcoal/60">Dafa Kitchen</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
          {links.map((link) => (
            <Link key={link.href} href={prefixMarketHref(link.href, market)} className="transition hover:text-date">
              {link.label}
            </Link>
          ))}
        </nav>

        {showMarketSwitcher ? (
          <div className="hidden items-center gap-1 rounded-lg border border-charcoal/10 bg-white p-1 text-xs font-black uppercase lg:flex">
            {marketCodes.map((code) => (
              <Link
                key={code}
                href={switchMarketHref(pathname, code)}
                className={`rounded-md px-2 py-1 transition ${market.code === code ? "bg-olive text-white" : "text-charcoal/60 hover:bg-warm-50"}`}
                title={gulfMarkets[code].countryNameEn}
              >
                {code}
              </Link>
            ))}
          </div>
        ) : null}

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
              href={prefixMarketHref(link.href, market)}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg bg-white px-4 py-3 text-sm font-bold"
            >
              {link.label}
            </Link>
          ))}
          {showMarketSwitcher ? (
            <div className="grid grid-cols-3 gap-2">
              {marketCodes.map((code) => (
                <Link
                  key={code}
                  href={switchMarketHref(pathname, code)}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-center text-xs font-black uppercase ${market.code === code ? "bg-olive text-white" : "bg-white"}`}
                >
                  {code}
                </Link>
              ))}
            </div>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
