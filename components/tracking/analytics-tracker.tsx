"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackAnalyticsEvent } from "@/lib/tracking";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackAnalyticsEvent("PageView", { path: `${window.location.origin}${pathname}${query ? `?${query}` : ""}` });
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest("a,button") : null;
      if (!target) return;
      trackAnalyticsEvent("Click", {
        metadata: {
          tag: target.tagName.toLowerCase(),
          label: target.textContent?.trim().slice(0, 120) || target.getAttribute("aria-label") || "",
          href: target instanceof HTMLAnchorElement ? target.href : undefined,
        },
      });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
