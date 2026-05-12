"use client";

import Link from "next/link";
import { ArrowLeft, Banknote, PhoneCall, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/ui/product-visual";
import { makeCartItem, useCartStore } from "@/store/cart-store";
import { createEventId } from "@/lib/event-id";
import { trackEvent } from "@/lib/tracking";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const defaultOffer = product.offers.find((offer) => offer.badge) ?? product.offers[0];

  function addDefaultOffer() {
    const item = makeCartItem(product, defaultOffer.id);
    addItem(item);
    trackEvent("AddToCart", {
      eventId: createEventId("atc"),
      value: item.totalPrice,
      currency: "SAR",
      productId: product.id,
      contentIds: [product.id],
      contentName: product.nameAr,
      items: [
        {
          product_id: product.id,
          title_ar: product.nameAr,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice,
        },
      ],
    });
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
        <p className="mt-3 text-sm font-bold leading-7 text-charcoal/65">{product.subheadingAr}</p>
        <div className="mt-4 grid gap-2 rounded-xl border border-gold/35 bg-[#FFF7E4] p-4 text-sm font-black leading-7 text-date">
          <span className="flex items-center gap-2">
            <Banknote size={19} className="shrink-0 text-gold" />
            الدفع عند الاستلام
          </span>
          <span className="flex items-center gap-2">
            <PhoneCall size={19} className="shrink-0 text-gold" />
            اتصال تأكيد قبل الشحن
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={19} className="shrink-0 text-gold" />
            ضمان ذهبي 30 يوم
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-charcoal/50">العروض تبدأ من</p>
            <p className="text-2xl font-black">199 ريال</p>
          </div>
          <div className="grid shrink-0 gap-2">
            <Button onClick={addDefaultOffer} variant="gold" className="px-4">
              <ShoppingCart size={16} />
              أضيفي للسلة
            </Button>
            <Link
              href={`/products/${product.slug}`}
              className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-charcoal/15 bg-white/70 px-4 py-2 text-sm font-bold transition hover:bg-white"
            >
              التفاصيل
              <ArrowLeft size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
