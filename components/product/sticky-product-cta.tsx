"use client";

import { ArrowUp, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";

export function StickyProductCta({ product }: { product: Product }) {
  const defaultOffer = product.offers.find((offer) => offer.id === "two") ?? product.offers[0];

  function scrollToOffer() {
    document.getElementById("product-offer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-warm-50/95 px-4 py-3 shadow-[0_-18px_50px_rgba(37,35,31,0.14)] backdrop-blur">
      <div className="container-shell flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-charcoal">{product.nameAr}</p>
          <p className="text-xs font-bold text-charcoal/60">{defaultOffer.badge ?? "العرض المختار"}: {defaultOffer.price} ريال</p>
        </div>
        <button
          type="button"
          onClick={scrollToOffer}
          className="focus-ring inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-black text-charcoal shadow-soft transition hover:bg-[#b98932]"
        >
          <ShoppingCart size={18} />
          اختاري العرض
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
