"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pack } from "@/data/packs";
import { getPackProducts } from "@/data/packs";
import { createEventId } from "@/lib/event-id";
import { trackEvent } from "@/lib/tracking";
import { makePackCartItems, useCartStore } from "@/store/cart-store";

export function AddPackButton({ pack, className = "" }: { pack: Pack; className?: string }) {
  const addItems = useCartStore((state) => state.addItems);
  const products = getPackProducts(pack);

  function handleAddPack() {
    const items = makePackCartItems(pack, products);
    addItems(items);

    trackEvent("AddToCart", {
      eventId: createEventId("pack_atc"),
      value: pack.price,
      currency: "SAR",
      contentIds: products.map((product) => product.id),
      contentName: pack.nameAr,
      items: items.map((item) => ({
        product_id: item.productId,
        title_ar: item.titleAr,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
      })),
      metadata: { pack_id: pack.id },
    });
  }

  return (
    <Button onClick={handleAddPack} variant="gold" className={className}>
      <ShoppingCart size={18} />
      أضيفي الباقة - {pack.price} ريال
    </Button>
  );
}
