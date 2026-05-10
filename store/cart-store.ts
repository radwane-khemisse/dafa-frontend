"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById, type OfferId, type Product } from "@/data/products";
import type { Pack } from "@/data/packs";

export type CartItem = {
  productId: Product["id"];
  offerId: OfferId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  titleAr: string;
  packId?: string;
  packName?: string;
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  addItems: (items: CartItem[]) => void;
  removeItem: (productId: Product["id"], offerId: OfferId) => void;
  removePack: (packId: string) => void;
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
          const blockedPackId = existing?.packId;
          const baseItems = blockedPackId
            ? state.items.filter((cartItem) => cartItem.packId !== blockedPackId)
            : state.items;
          if (existing) {
            return {
              items: baseItems.map((cartItem) =>
                cartItem.productId === item.productId ? item : cartItem,
              ).concat(baseItems.some((cartItem) => cartItem.productId === item.productId) ? [] : [item]),
              isCartOpen: true,
            };
          }
          return { items: [...baseItems, item], isCartOpen: true };
        }),
      addItems: (items) =>
        set((state) => {
          const incomingProductIds = new Set(items.map((item) => item.productId));
          const incomingPackIds = new Set(items.map((item) => item.packId).filter(Boolean));
          const replacedPackIds = new Set(
            state.items
              .filter((item) => incomingProductIds.has(item.productId) && item.packId)
              .map((item) => item.packId),
          );
          const nextItems = state.items.filter((item) => {
            if (incomingProductIds.has(item.productId)) return false;
            if (item.packId && incomingPackIds.has(item.packId)) return false;
            if (item.packId && replacedPackIds.has(item.packId)) return false;
            return true;
          });
          return { items: [...nextItems, ...items], isCartOpen: true };
        }),
      removeItem: (productId, offerId) =>
        set((state) => {
          const target = state.items.find((item) => item.productId === productId && item.offerId === offerId);
          if (target?.packId) {
            return { items: state.items.filter((item) => item.packId !== target.packId) };
          }
          return { items: state.items.filter((item) => item.productId !== productId || item.offerId !== offerId) };
        }),
      removePack: (packId) =>
        set((state) => ({
          items: state.items.filter((item) => item.packId !== packId),
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
      : offerId === "pack_pair"
        ? { id: "pack_pair" as const, quantity: 1, price: 159, labelAr: "ضمن باقة" }
      : product.offers.find((candidate) => candidate.id === offerId);

  if (!offer) {
    throw new Error(`Unknown offer ${offerId}`);
  }

  return {
    productId: product.id,
    offerId,
    quantity: offer.quantity,
    unitPrice: calculateUnitPrice(offer.price, offer.quantity),
    totalPrice: offer.price,
    titleAr: product.nameAr,
  };
}

export function makePackCartItems(pack: Pack, products: Product[]): CartItem[] {
  const lineTotals = splitTotal(pack.price, products.length);

  return products.map((product, index) => ({
    productId: product.id,
    offerId: pack.offerId,
    quantity: 1,
    unitPrice: lineTotals[index],
    totalPrice: lineTotals[index],
    titleAr: `${product.nameAr} - ضمن ${pack.nameAr}`,
    packId: pack.id,
    packName: pack.nameAr,
  }));
}

function calculateUnitPrice(totalPrice: number, quantity: number) {
  return Number((totalPrice / quantity).toFixed(2));
}

function splitTotal(total: number, count: number) {
  if (count <= 0) return [];
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

export function getCartProductIds(items: CartItem[]) {
  return items.map((item) => item.productId);
}

export function getCartProducts(items: CartItem[]) {
  return items.map((item) => getProductById(item.productId)).filter(Boolean) as Product[];
}
