import type { CartItem } from "@/store/cart-store";
import { collectAttribution } from "@/lib/tracking";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type CreateOrderInput = {
  eventId: string;
  name: string;
  phone: string;
  items: CartItem[];
  upsellAccepted: boolean;
};

export async function createOrder(input: CreateOrderInput) {
  const subtotal = input.items.reduce((sum, item) => sum + item.totalPrice, 0);

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_id: input.eventId,
      name: input.name,
      phone: input.phone,
      items: input.items.map((item) => ({
        product_id: item.productId,
        offer_id: item.offerId,
        pack_id: item.packId,
        pack_name: item.packName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
      })),
      upsell: {
        accepted: input.upsellAccepted,
        product_id: input.items.find((item) => item.offerId === "upsell_99")?.productId,
        price: input.upsellAccepted ? 99 : undefined,
      },
      totals: {
        subtotal,
        delivery_fee: 0,
        discount: 0,
        total: subtotal,
        currency: "SAR",
      },
      client: collectAttribution(),
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || "تعذر تأكيد الطلب، حاولي مرة أخرى.");
  }

  return response.json() as Promise<{ ok: boolean; order_id: string; purchase_event_id: string; status: string }>;
}
