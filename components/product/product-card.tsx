"use client";

import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/ui/product-visual";
import { makeCartItem, useCartStore } from "@/store/cart-store";
import { createEventId } from "@/lib/event-id";
import { trackPixelEvent } from "@/lib/tracking";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  function addDefaultOffer() {
    const item = makeCartItem(product, "two");
    addItem(item);
    trackPixelEvent("AddToCart", { value: item.totalPrice, currency: "SAR", content_ids: [product.id] }, createEventId("atc"));
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-soft transition hover:-translate-y-1 hover:border-gold/50">
      <Link href={`/products/${product.slug}`}>
        <ProductVisual product={product} className="min-h-[220px] rounded-none border-0 shadow-none" />
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-black text-date">{product.role}</span>
          <span className="flex items-center gap-1 text-xs font-bold text-charcoal/70">
            <Star size={14} className="fill-gold text-gold" /> {product.rating}
          </span>
        </div>
        <h3 className="text-xl font-black">{product.nameAr}</h3>
        <p className="mt-2 text-sm font-bold leading-7 text-date">{product.headlineAr}</p>
        <p className="mt-2 text-sm leading-7 text-charcoal/65">{product.subheadingAr}</p>
        <div className="mt-4 grid gap-2">
          {product.benefits.slice(0, 2).map((benefit) => (
            <div key={benefit} className="flex gap-2 rounded-xl bg-warm-50 p-3 text-xs font-bold leading-6 text-charcoal/75">
              <CheckCircle2 size={16} className="mt-1 shrink-0 text-olive" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-gold/35 bg-[#FFF7E4] p-3 text-xs font-black leading-6 text-date">
          دفع عند الاستلام، اتصال تأكيد قبل الشحن، وضمان ذهبي 30 يوم.
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-charcoal/50">ابتداء من</p>
            <p className="text-2xl font-black">199 ريال</p>
          </div>
          <Button onClick={addDefaultOffer} variant="gold">اختاري العرض</Button>
        </div>
      </div>
    </article>
  );
}
