import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans_Arabic, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PixelScripts } from "@/components/tracking/pixel-scripts";
import { TrustTicker } from "@/components/layout/trust-ticker";

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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        suppressHydrationWarning
        className={`${ibmPlexSansArabic.variable} ${notoSansArabic.variable} ${bricolageGrotesque.variable} flex min-h-screen flex-col`}
      >
        <PixelScripts />
        <Header />
        <TrustTicker />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
