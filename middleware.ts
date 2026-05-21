import { NextRequest, NextResponse } from "next/server";
import { isMarketCode } from "@/lib/markets";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const segments = url.pathname.split("/").filter(Boolean);
  const marketCode = segments[0];

  const requestHeaders = new Headers(request.headers);
  if (isMarketCode(marketCode)) {
    requestHeaders.set("x-market-code", marketCode);
    url.pathname = `/${segments.slice(1).join("/")}`;
    if (url.pathname === "/") {
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  requestHeaders.set("x-market-code", "ksa");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
