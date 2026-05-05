"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById, type OfferId, type Product } from "@/data/products";

export type CartItem = {
  productId: Product["id"];
  offerId: OfferId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  titleAr: string;
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: Product["id"], offerId: OfferId) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((cartItem) => cartItem.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId ? item : cartItem,
              ),
              isCartOpen: true,
            };
          }
          return { items: [...state.items, item], isCartOpen: true };
        }),
      removeItem: (productId, offerId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId || item.offerId !== offerId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "dafa-kitchen-cart" },
  ),
);

export function makeCartItem(product: Product, offerId: OfferId): CartItem {
  const offer =
    offerId === "upsell_99"
      ? { id: "upsell_99" as const, quantity: 1, price: 99, labelAr: "عرض خاص" }
      : product.offers.find((candidate) => candidate.id === offerId);

  if (!offer) {
    throw new Error(`Unknown offer ${offerId}`);
  }

  return {
    productId: product.id,
    offerId,
    quantity: offer.quantity,
    unitPrice: Math.round(offer.price / offer.quantity),
    totalPrice: offer.price,
    titleAr: product.nameAr,
  };
}

export function getCartProductIds(items: CartItem[]) {
  return items.map((item) => item.productId);
}

export function getCartProducts(items: CartItem[]) {
  return items.map((item) => getProductById(item.productId)).filter(Boolean) as Product[];
}
