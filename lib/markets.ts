export type MarketCode = "ksa" | "kwt" | "uae" | "qat" | "bhr" | "omn";

export type Market = {
  code: MarketCode;
  countryCode: string;
  countryNameAr: string;
  countryAdjectiveAr: string;
  countryNameEn: string;
  currency: string;
  active: boolean;
  phoneCountryCode: string;
  localPhoneDigits: number;
};

export const gulfMarkets: Record<MarketCode, Market> = {
  ksa: {
    code: "ksa",
    countryCode: "SA",
    countryNameAr: "السعودية",
    countryAdjectiveAr: "السعودي",
    countryNameEn: "Saudi Arabia",
    currency: "SAR",
    active: true,
    phoneCountryCode: "966",
    localPhoneDigits: 9,
  },
  kwt: {
    code: "kwt",
    countryCode: "KW",
    countryNameAr: "الكويت",
    countryAdjectiveAr: "الكويتي",
    countryNameEn: "Kuwait",
    currency: "KWD",
    active: true,
    phoneCountryCode: "965",
    localPhoneDigits: 8,
  },
  uae: {
    code: "uae",
    countryCode: "AE",
    countryNameAr: "الإمارات",
    countryAdjectiveAr: "الإماراتي",
    countryNameEn: "United Arab Emirates",
    currency: "AED",
    active: true,
    phoneCountryCode: "971",
    localPhoneDigits: 9,
  },
  qat: {
    code: "qat",
    countryCode: "QA",
    countryNameAr: "قطر",
    countryAdjectiveAr: "القطري",
    countryNameEn: "Qatar",
    currency: "QAR",
    active: true,
    phoneCountryCode: "974",
    localPhoneDigits: 8,
  },
  bhr: {
    code: "bhr",
    countryCode: "BH",
    countryNameAr: "البحرين",
    countryAdjectiveAr: "البحريني",
    countryNameEn: "Bahrain",
    currency: "BHD",
    active: true,
    phoneCountryCode: "973",
    localPhoneDigits: 8,
  },
  omn: {
    code: "omn",
    countryCode: "OM",
    countryNameAr: "عمان",
    countryAdjectiveAr: "العماني",
    countryNameEn: "Oman",
    currency: "OMR",
    active: true,
    phoneCountryCode: "968",
    localPhoneDigits: 8,
  },
};

export const marketCodes = Object.keys(gulfMarkets) as MarketCode[];

export function isMarketCode(value: string | undefined): value is MarketCode {
  return !!value && value in gulfMarkets;
}

export function marketFromPath(pathname: string | null | undefined): Market {
  const segment = (pathname || "").split("/").filter(Boolean)[0];
  return isMarketCode(segment) ? gulfMarkets[segment] : gulfMarkets.ksa;
}

export function prefixMarketHref(href: string, market: Market) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (market.code === "ksa" && href === "/") return "/ksa";
  if (marketCodes.some((code) => href === `/${code}` || href.startsWith(`/${code}/`))) return href;
  return `/${market.code}${href === "/" ? "" : href}`;
}

export function switchMarketHref(pathname: string | null | undefined, marketCode: MarketCode) {
  const segments = (pathname || "/").split("/").filter(Boolean);
  const rest = isMarketCode(segments[0]) ? segments.slice(1) : segments;
  const suffix = rest.length ? `/${rest.join("/")}` : "";
  return `/${marketCode}${suffix}`;
}

export function formatMarketPrice(value: number | string, market: Pick<Market, "currency">) {
  return `${value} ${market.currency}`;
}

export type ApiMarket = {
  code: string;
  country_code: string;
  country_name_ar: string;
  country_name_en: string;
  active: boolean;
  currency: string;
  phone_country_code: string;
  local_phone_digits: number;
};

export function mergeApiMarket(apiMarket?: ApiMarket): Market {
  if (!apiMarket || !isMarketCode(apiMarket.code)) return gulfMarkets.ksa;
  return {
    ...gulfMarkets[apiMarket.code],
    active: apiMarket.active,
    currency: apiMarket.currency,
    countryNameAr: apiMarket.country_name_ar,
    countryAdjectiveAr: gulfMarkets[apiMarket.code].countryAdjectiveAr,
    countryNameEn: apiMarket.country_name_en,
    phoneCountryCode: apiMarket.phone_country_code,
    localPhoneDigits: apiMarket.local_phone_digits,
  };
}
