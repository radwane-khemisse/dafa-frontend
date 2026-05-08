declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void };
    snaptr?: (...args: unknown[]) => void;
  }
}

type TrackingPayload = {
  value?: number;
  currency?: string;
  content_ids?: string[];
  contents?: unknown[];
  content_name?: string;
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

export function trackPixelEvent(eventName: string, payload: TrackingPayload = {}, eventId?: string) {
  if (typeof window === "undefined") return;

  if (debug) {
    console.info("[pixel]", eventName, { eventId, payload });
  }

  if (window.fbq) {
    window.fbq("track", eventName, payload, eventId ? { eventID: eventId } : undefined);
  }

  if (window.ttq) {
    window.ttq.track(eventName, { ...payload, event_id: eventId });
  }

  if (window.snaptr) {
    const snapEvent = eventName === "Purchase" ? "PURCHASE" : eventName;
    window.snaptr("track", snapEvent, { ...payload, client_dedup_id: eventId });
  }

  const productId = Array.isArray(payload.content_ids) && typeof payload.content_ids[0] === "string" ? payload.content_ids[0] : undefined;
  void trackAnalyticsEvent(eventName, { eventId, productId, metadata: payload });
}

export function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
  return "";
}

export function collectAttribution() {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  return {
    landing_page: window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    ttp: getCookie("_ttp"),
    ttclid: params.get("ttclid") ?? "",
    sc_click_id: params.get("ScCid") ?? params.get("sc_click_id") ?? "",
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    utm_content: params.get("utm_content") ?? "",
    utm_term: params.get("utm_term") ?? "",
  };
}

export type AnalyticsEventInput = {
  eventId?: string;
  productId?: string;
  path?: string;
  metadata?: Record<string, unknown>;
};

export function trackAnalyticsEvent(eventName: string, input: AnalyticsEventInput = {}) {
  if (typeof window === "undefined") return;

  const attribution = collectAttribution();
  const body = JSON.stringify({
    event_name: eventName,
    event_id: input.eventId,
    session_id: getSessionId(),
    product_id: input.productId,
    path: input.path ?? window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    metadata: input.metadata,
  });

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(`${API_BASE_URL}/events`, new Blob([body], { type: "application/json" }));
    if (sent) return;
  }

  fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
