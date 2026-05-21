import type { Pack } from "@/data/packs";
import type { Product } from "@/data/products";
import { getCurrentMarket } from "@/lib/market-server";
import { mergeApiMarket, type ApiMarket, type Market } from "@/lib/markets";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type CatalogVisibility = {
  market: Market;
  hidden_products: string[];
  hidden_packs: string[];
  offer_prices: Record<string, Record<string, number>>;
};

const defaultVisibility: CatalogVisibility = {
  market: mergeApiMarket(),
  hidden_products: [],
  hidden_packs: [],
  offer_prices: {},
};

export async function getCatalogVisibility(): Promise<CatalogVisibility> {
  const market = await getCurrentMarket();
  try {
    const response = await fetch(`${API_BASE_URL}/catalog/visibility?market=${encodeURIComponent(market.code)}`, { cache: "no-store" });
    if (!response.ok) return { ...defaultVisibility, market };
    const payload = (await response.json()) as { market?: ApiMarket; hidden_products?: string[]; hidden_packs?: string[]; offer_prices?: Record<string, Record<string, number>> };
    return {
      market: mergeApiMarket(payload.market),
      hidden_products: payload.hidden_products ?? [],
      hidden_packs: payload.hidden_packs ?? [],
      offer_prices: payload.offer_prices ?? {},
    };
  } catch {
    return { ...defaultVisibility, market };
  }
}

export function applyOfferPrices(allProducts: Product[], visibility: CatalogVisibility) {
  return allProducts.map((product) => ({
    ...product,
    offers: product.offers.map((offer) => ({
      ...offer,
      price: visibility.offer_prices[product.id]?.[offer.id] ?? offer.price,
    })),
  }));
}

export function visibleProducts(allProducts: Product[], visibility: CatalogVisibility) {
  const hiddenProducts = new Set(visibility.hidden_products);
  return allProducts.filter((product) => !hiddenProducts.has(product.id));
}

export function visiblePacks(allPacks: Pack[], visibility: CatalogVisibility) {
  const hiddenProducts = new Set(visibility.hidden_products);
  const hiddenPacks = new Set(visibility.hidden_packs);
  return allPacks.filter((pack) => !hiddenPacks.has(pack.id) && pack.productIds.every((productId) => !hiddenProducts.has(productId)));
}
