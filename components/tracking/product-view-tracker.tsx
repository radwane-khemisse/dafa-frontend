"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/tracking";

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackAnalyticsEvent("ViewProduct", { productId, metadata: { product_id: productId } });
  }, [productId]);

  return null;
}
