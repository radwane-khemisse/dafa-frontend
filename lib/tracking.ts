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

