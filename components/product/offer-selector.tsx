"use client";

import { Check, ShieldCheck, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { OfferId, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { makeCartItem, useCartStore } from "@/store/cart-store";
import { createEventId } from "@/lib/event-id";
import { trackEvent } from "@/lib/tracking";
import { formatMarketPrice } from "@/lib/markets";
import { useCurrentMarket } from "@/lib/market-client";

export function OfferSelector({ product, compact = false }: { product: Product; compact?: boolean }) {
  const market = useCurrentMarket();
  const defaultOffer = product.offers.find((candidate) => candidate.badge) ?? product.offers[0];
  const [selectedOffer, setSelectedOffer] = useState<OfferId>(defaultOffer.id);
  const addItem = useCartStore((state) => state.addItem);
  const offer = product.offers.find((candidate) => candidate.id === selectedOffer) ?? defaultOffer;
  const singleItemPrice = product.offers.find((candidate) => candidate.id === "one")?.price ?? product.offers[0].price;

  function handleAdd() {
    const item = makeCartItem(product, selectedOffer);
    addItem(item);
    const eventId = createEventId("atc");
    trackEvent(
      "AddToCart",
      {
        eventId,
        value: item.totalPrice,
        currency: market.currency,
        contentIds: [product.id],
        contentName: product.nameAr,
        productId: product.id,
        items: [
          {
            product_id: product.id,
            title_ar: product.nameAr,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice,
          },
        ],
      },
    );
  }

  return (
    <div className={`rounded-2xl border border-charcoal/10 bg-white p-4 shadow-soft ${compact ? "" : "md:p-6"}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black">اختاري العرض الأنسب لبيتك</p>
        </div>
      </div>

      <div className="grid gap-4 pt-2">
        {product.offers.map((candidate) => {
          const discount = Math.max(singleItemPrice * candidate.quantity - candidate.price, 0);

          return (
            <button
              key={candidate.id}
              type="button"
              onClick={() => setSelectedOffer(candidate.id)}
              className={`focus-ring relative flex items-center justify-between rounded-xl border p-3 text-start transition ${
                selectedOffer === candidate.id
                  ? "border-gold bg-[#FFF8E8]"
                  : "border-charcoal/10 bg-warm-50 hover:bg-white"
              }`}
            >
              {candidate.badge ? (
                <span
                  className={`absolute -top-4 right-5 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-black shadow-soft ${
                    candidate.id === "three"
                      ? "border-discount/25 bg-discount text-white"
                      : "border-gold/40 bg-gold text-charcoal"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {candidate.badge}
                </span>
              ) : null}
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
                </span>
              </span>
              <span className="text-start">
                <span className="block text-lg font-black">{formatMarketPrice(candidate.price, market)}</span>
                <span className="mt-1 block text-xs font-black text-discount">
                  {discount > 0 ? `وفرتِ ${formatMarketPrice(discount, market)}` : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <Button onClick={handleAdd} className="mt-5 w-full text-base" variant="gold">
        <ShoppingCart size={18} />
        أضيفي للسلة - {formatMarketPrice(offer.price, market)}
      </Button>
      
    </div>
  );
}
