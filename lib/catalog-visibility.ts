import type { Product } from "@/data/products";
import { getCurrentMarket } from "@/lib/market-server";
import { mergeApiMarket, type ApiMarket, type Market } from "@/lib/markets";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type CatalogVisibility = {
  market: Market;
  hidden_products: string[];
  offer_prices: Record<string, Record<string, number>>;
  product_warehouses: Record<string, string>;
  product_upsells: Record<string, string[]>;
};

const defaultVisibility: CatalogVisibility = {
  market: mergeApiMarket(),
  hidden_products: [],
  offer_prices: {},
  product_warehouses: {},
  product_upsells: {},
};

export async function getCatalogVisibility(): Promise<CatalogVisibility> {
  const market = await getCurrentMarket();
  try {
    const response = await fetch(`${API_BASE_URL}/catalog/visibility?market=${encodeURIComponent(market.code)}`, { cache: "no-store" });
    if (!response.ok) return { ...defaultVisibility, market };
    const payload = (await response.json()) as {
      market?: ApiMarket;
      hidden_products?: string[];
      offer_prices?: Record<string, Record<string, number>>;
      product_warehouses?: Record<string, string>;
      product_upsells?: Record<string, string[]>;
    };
    return {
      market: mergeApiMarket(payload.market),
      hidden_products: payload.hidden_products ?? [],
      offer_prices: payload.offer_prices ?? {},
      product_warehouses: payload.product_warehouses ?? {},
      product_upsells: payload.product_upsells ?? {},
    };
  } catch {
    return { ...defaultVisibility, market };
  }
}

export function applyOfferPrices(allProducts: Product[], visibility: CatalogVisibility) {
  return allProducts.map((product) => ({
    ...product,
    warehouse: visibility.product_warehouses[product.id] ?? product.warehouse,
    offers: product.offers.map((offer) => ({
      ...offer,
      price: visibility.offer_prices[product.id]?.[offer.id] ?? offer.price,
    })),
  }));
}

export function visibleProducts(allProducts: Product[], visibility: CatalogVisibility) {
  const hiddenProducts = new Set(visibility.hidden_products);
  return allProducts.filter((product) => !hiddenProducts.has(product.id) && isProductMarketVisible(product, visibility.market.code));
}

export function isProductMarketVisible(product: Product, marketCode: string) {
  return !product.marketCodes || product.marketCodes.includes(marketCode);
}

export function sameWarehouseProducts(allProducts: Product[], anchor: Product | undefined) {
  const warehouse = anchor?.warehouse?.trim();
  if (!warehouse) return allProducts;
  return allProducts.filter((product) => product.warehouse === warehouse);
}
