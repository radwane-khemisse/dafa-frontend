import type { Pack } from "@/data/packs";
import type { Product } from "@/data/products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type CatalogVisibility = {
  hidden_products: string[];
  hidden_packs: string[];
};

const defaultVisibility: CatalogVisibility = {
  hidden_products: [],
  hidden_packs: [],
};

export async function getCatalogVisibility(): Promise<CatalogVisibility> {
  try {
    const response = await fetch(`${API_BASE_URL}/catalog/visibility`, { cache: "no-store" });
    if (!response.ok) return defaultVisibility;
    return (await response.json()) as CatalogVisibility;
  } catch {
    return defaultVisibility;
  }
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
