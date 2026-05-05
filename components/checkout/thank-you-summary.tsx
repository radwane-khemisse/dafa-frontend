"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/data/products";
import type { CartItem } from "@/store/cart-store";
import { ProductVisual } from "@/components/ui/product-visual";

type LastOrderSnapshot = {
  orderId?: string;
  total?: number;
  items?: CartItem[];
  createdAt?: string;
};

export function ThankYouSummary() {
  const [snapshot, setSnapshot] = useState<LastOrderSnapshot | null>(null);

  useEffect(() => {
    const rawSnapshot = window.localStorage.getItem("dafa-kitchen-last-order");
    if (!rawSnapshot) return;

    try {
      const parsed = JSON.parse(rawSnapshot) as LastOrderSnapshot;
      setSnapshot(parsed);
    } catch {
      setSnapshot(null);
    }
  }, []);

  if (!snapshot?.items?.length) {
    return null;
  }

  return (
    <div className="mt-6 rounded-2xl bg-warm-50 p-5 text-start">
      <p className="mb-4 font-black">ملخص المنتجات المطلوبة</p>
      <div className="grid gap-3">
        {snapshot.items.map((item) => {
          const product = getProductById(item.productId);

          return (
            <div key={`${item.productId}-${item.offerId}`} className="flex items-start gap-3 rounded-2xl bg-white p-3">
              {product ? <ProductVisual product={product} compact className="w-24 shrink-0 rounded-xl shadow-none" /> : null}
              <div className="min-w-0 flex-1">
                <p className="font-black">{item.titleAr}</p>
                <p className="mt-1 text-sm text-charcoal/60">الكمية: {item.quantity}</p>
                <p className="mt-2 text-lg font-black">{item.totalPrice} ريال</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
