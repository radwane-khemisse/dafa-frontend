"use client";

import { useEffect } from "react";
import { createEventId } from "@/lib/event-id";
import { trackEvent } from "@/lib/tracking";

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackEvent("ViewProduct", {
      eventId: createEventId("view_product"),
      productId,
      contentIds: [productId],
      metadata: { product_id: productId },
    });
  }, [productId]);

  return null;
}
