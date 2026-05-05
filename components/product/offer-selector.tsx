"use client";

import { Award, Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { OfferId, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { makeCartItem, useCartStore } from "@/store/cart-store";
import { createEventId } from "@/lib/event-id";
import { trackPixelEvent } from "@/lib/tracking";

export function OfferSelector({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [selectedOffer, setSelectedOffer] = useState<OfferId>("two");
  const addItem = useCartStore((state) => state.addItem);
  const offer = product.offers.find((candidate) => candidate.id === selectedOffer) ?? product.offers[0];

  function handleAdd() {
    const item = makeCartItem(product, selectedOffer);
    addItem(item);
    const eventId = createEventId("atc");
    trackPixelEvent(
      "AddToCart",
      {
        value: item.totalPrice,
        currency: "SAR",
        content_ids: [product.id],
        content_name: product.nameAr,
      },
      eventId,
    );
  }

  return (
    <div className={`rounded-2xl border border-charcoal/10 bg-white p-4 shadow-soft ${compact ? "" : "md:p-6"}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black">اختاري الكمية المناسبة لبيتك</p>
          <p className="text-xs text-charcoal/60">الدفع عند الاستلام، ونكلمك قبل الشحن للتأكيد</p>
        </div>
        <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-black text-date">وفر أكثر مع 2 أو 3</span>
      </div>

      <div className="grid gap-3">
        {product.offers.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            onClick={() => setSelectedOffer(candidate.id)}
            className={`focus-ring flex items-center justify-between rounded-xl border p-3 text-start transition ${
              selectedOffer === candidate.id
                ? "border-gold bg-[#FFF8E8]"
                : "border-charcoal/10 bg-warm-50 hover:bg-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  selectedOffer === candidate.id ? "border-gold bg-gold" : "border-charcoal/20"
                }`}
              >
                {selectedOffer === candidate.id ? <Check size={14} /> : null}
              </span>
              <span>
                <span className="block text-sm font-black">{candidate.labelAr}</span>
                <span className="text-xs font-bold text-charcoal/55">
                  {Math.round(candidate.price / candidate.quantity)} ريال للقطعة
                </span>
                {candidate.badge ? <span className="block text-xs font-bold text-olive">{candidate.badge}</span> : null}
              </span>
            </span>
            <span className="text-lg font-black">{candidate.price} ريال</span>
          </button>
        ))}
      </div>

      <Button onClick={handleAdd} className="mt-5 w-full text-base" variant="gold">
        <ShoppingCart size={18} />
        أضيفي للسلة - {offer.price} ريال
      </Button>
      <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 bg-[#FFF7E4] px-4 py-3 text-center text-xs font-black text-date">
        <Award size={18} className="text-gold" />
        ضمان ذهبي 30 يوم
      </div>
    </div>
  );
}
