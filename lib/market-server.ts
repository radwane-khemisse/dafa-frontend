import { headers } from "next/headers";
import { gulfMarkets, isMarketCode, type Market } from "@/lib/markets";

export async function getCurrentMarket(): Promise<Market> {
  const headerStore = await headers();
  const headerMarket = headerStore.get("x-market-code") || "ksa";
  return isMarketCode(headerMarket) ? gulfMarkets[headerMarket] : gulfMarkets.ksa;
}
