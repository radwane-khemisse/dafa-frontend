import type { Metadata } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, IBM_Plex_Sans_Arabic, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PixelScripts } from "@/components/tracking/pixel-scripts";
import { AnalyticsTracker } from "@/components/tracking/analytics-tracker";
import { TrustTicker } from "@/components/layout/trust-ticker";
import { MarketContentRewriter } from "@/components/market/market-content-rewriter";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-arabic",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-logo-latin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مطبخ دفا | Dafa Kitchen",
  description: "بيت اختيار أدوات المطبخ العملية للبيت السعودي: تحضير أسرع، مؤونة أرتب، وحوض أنظف.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=pro", sizes: "any" },
      { url: "/favicon-16x16.png?v=pro", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=pro", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=pro", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png?v=pro", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png?v=pro", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png?v=pro", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=pro", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico?v=pro"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        suppressHydrationWarning
        className={`${ibmPlexSansArabic.variable} ${notoSansArabic.variable} ${bricolageGrotesque.variable} flex min-h-screen flex-col`}
      >
        <PixelScripts />
        <MarketContentRewriter />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Header />
        <TrustTicker />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
