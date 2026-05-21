"use client";

import { usePathname } from "next/navigation";
import { marketFromPath, prefixMarketHref } from "@/lib/markets";

export function useCurrentMarket() {
  return marketFromPath(usePathname());
}

export function useMarketHref(href: string) {
  return prefixMarketHref(href, useCurrentMarket());
}
