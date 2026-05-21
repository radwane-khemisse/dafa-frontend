"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { prefixMarketHref } from "@/lib/markets";
import { useCurrentMarket } from "@/lib/market-client";

const variants = {
  primary: "bg-charcoal text-white hover:bg-date",
  gold: "bg-gold text-charcoal hover:bg-[#b98932]",
  outline: "border border-charcoal/15 bg-white/70 text-charcoal hover:bg-white",
  ghost: "text-charcoal hover:bg-charcoal/5",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className = "",
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
}) {
  const market = useCurrentMarket();

  return (
    <Link
      href={prefixMarketHref(href, market)}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

