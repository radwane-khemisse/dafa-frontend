declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (...args: unknown[]) => void;
      page: () => void;
      identify?: (...args: unknown[]) => void;
      enableCookie?: () => void;
    };
    snaptr?: (...args: unknown[]) => void;
  }
}

export type CanonicalTrackingEvent =
  | "PageView"
  | "ViewProduct"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Lead"
  | "Purchase"
  | "UpsellView"
  | "UpsellAccepted"
  | "UpsellRejected"
  | "Click";

export type TrackingItem = {
  product_id: string;
  title_ar?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
};

export type TrackingPayload = {
  eventId?: string;
  sessionId?: string;
  productId?: string;
  contentName?: string;
  contentIds?: string[];
  items?: TrackingItem[];
  value?: number;
  currency?: string;
  name?: string;
  phone?: string;
  path?: string;
  sendServer?: boolean;
  metadata?: Record<string, unknown>;
};

const META_EVENTS: Record<string, string> = {
  PageView: "PageView",
  ViewProduct: "ViewContent",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Lead: "Lead",
  Purchase: "Purchase",
  UpsellView: "UpsellView",
  UpsellAccepted: "UpsellAccepted",
  UpsellRejected: "UpsellRejected",
};

const TIKTOK_EVENTS: Record<string, string> = {
  PageView: "Pageview",
  ViewProduct: "ViewContent",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Lead: "SubmitForm",
  Purchase: "CompletePayment",
  UpsellView: "UpsellView",
  UpsellAccepted: "UpsellAccepted",
  UpsellRejected: "UpsellRejected",
};

const SNAP_EVENTS: Record<string, string> = {
  PageView: "PAGE_VIEW",
  ViewProduct: "VIEW_CONTENT",
  ViewContent: "VIEW_CONTENT",
  AddToCart: "ADD_CART",
  InitiateCheckout: "START_CHECKOUT",
  Lead: "SIGN_UP",
  Purchase: "PURCHASE",
  UpsellView: "CUSTOM_EVENT_1",
  UpsellAccepted: "CUSTOM_EVENT_2",
  UpsellRejected: "CUSTOM_EVENT_3",
};

const debug = process.env.NEXT_PUBLIC_ENABLE_PIXEL_DEBUG === "true";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function getSessionId() {
  if (typeof window === "undefined") return "";
  const key = "dafa-kitchen-session-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(key, next);
  return next;
}

function getStoredValue(key: string) {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(key) || "";
}

function setStoredValue(key: string, value: string | null) {
  if (typeof window === "undefined" || !value) return "";
  window.localStorage.setItem(key, value);
  return value;
}

export function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
  return "";
}

function getParam(params: URLSearchParams, names: string[]) {
  for (const name of names) {
    const value = params.get(name);
    if (value) return value;
  }
  return "";
}

function getMetaFbc(params: URLSearchParams) {
  const cookieValue = getCookie("_fbc");
  if (cookieValue) return cookieValue;
  const stored = getStoredValue("dafa-kitchen-fbc");
  if (stored) return stored;
  const fbclid = getParam(params, ["fbclid"]);
  if (!fbclid) return "";
  return setStoredValue("dafa-kitchen-fbc", `fb.1.${Date.now()}.${fbclid}`);
}

export function collectAttribution() {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const fbclid = setStoredValue("dafa-kitchen-fbclid", getParam(params, ["fbclid"])) || getStoredValue("dafa-kitchen-fbclid");
  const ttclid = setStoredValue("dafa-kitchen-ttclid", getParam(params, ["ttclid"])) || getStoredValue("dafa-kitchen-ttclid");
  const scClickId =
    setStoredValue("dafa-kitchen-sc-click-id", getParam(params, ["ScCid", "sccid", "scid", "sc_click_id"])) ||
    getStoredValue("dafa-kitchen-sc-click-id");

  return {
    source_url: window.location.href,
    landing_page: window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    fbp: getCookie("_fbp"),
    fbc: getMetaFbc(params),
    fbclid,
    ttp: getCookie("_ttp"),
    ttclid,
    sc_click_id: scClickId,
    sc_cookie1: getCookie("_scid") || getCookie("sc_cookie1"),
    utm_source: getParam(params, ["utm_source"]),
    utm_medium: getParam(params, ["utm_medium"]),
    utm_campaign: getParam(params, ["utm_campaign"]),
    utm_content: getParam(params, ["utm_content"]),
    utm_term: getParam(params, ["utm_term"]),
  };
}

export function trackEvent(eventName: CanonicalTrackingEvent, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") return;
  const eventId = payload.eventId || `${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const contentIds = payload.contentIds || (payload.productId ? [payload.productId] : undefined);
  const pixelPayload = {
    value: payload.value,
    currency: payload.currency || "SAR",
    content_ids: contentIds,
    contents: payload.items?.map((item) => ({
      id: item.product_id,
      quantity: item.quantity || 1,
      item_price: item.unit_price || item.total_price,
    })),
    content_name: payload.contentName,
  };
  const cleanPixelPayload = Object.fromEntries(
    Object.entries(pixelPayload).filter(([, value]) => value !== undefined && value !== null),
  );

  if (debug) {
    console.info("[tracking]", eventName, { eventId, payload: cleanPixelPayload });
  }

  if (eventName !== "Click") {
    trackBrowserPixels(eventName, cleanPixelPayload, eventId);
  }
  if (payload.sendServer !== false) {
    trackServerEvent(eventName, { ...payload, eventId, contentIds });
  }
}

export function trackPixelEvent(eventName: CanonicalTrackingEvent, payload: TrackingPayload = {}, eventId?: string) {
  trackEvent(eventName, { ...payload, eventId });
}

function trackBrowserPixels(eventName: CanonicalTrackingEvent, payload: Record<string, unknown>, eventId: string) {
  const metaEvent = META_EVENTS[eventName] || eventName;
  const tiktokEvent = TIKTOK_EVENTS[eventName] || eventName;
  const snapEvent = SNAP_EVENTS[eventName] || eventName;

  if (window.fbq) {
    window.fbq("track", metaEvent, payload, { eventID: eventId });
  }

  if (window.ttq) {
    window.ttq.track(tiktokEvent, { ...payload, event_id: eventId });
  }

  if (window.snaptr) {
    window.snaptr("track", snapEvent, {
      ...payload,
      client_dedup_id: eventId,
      transaction_id: eventName === "Purchase" ? eventId : undefined,
    });
  }
}

function trackServerEvent(eventName: CanonicalTrackingEvent, payload: TrackingPayload & { eventId: string; contentIds?: string[] }) {
  const attribution = collectAttribution();
  const body = JSON.stringify({
    event_name: eventName,
    event_id: payload.eventId,
    session_id: payload.sessionId || getSessionId(),
    product_id: payload.productId,
    content_name: payload.contentName,
    content_ids: payload.contentIds || [],
    items: payload.items || [],
    value: payload.value,
    currency: payload.currency || "SAR",
    name: payload.name,
    phone: payload.phone,
    metadata: payload.metadata,
    client: {
      ...attribution,
      source_url: payload.path || attribution.source_url,
    },
  });

  const url = `${API_BASE_URL}/tracking/events`;
  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    if (sent) return;
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
