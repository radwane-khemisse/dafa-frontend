import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AddPackButton } from "@/components/pack/pack-actions";
import { packImages } from "@/components/ui/product-visual";
import type { Pack } from "@/data/packs";
import { formatMarketPrice, prefixMarketHref } from "@/lib/markets";
import { getCurrentMarket } from "@/lib/market-server";

export async function PackCard({ pack }: { pack: Pack }) {
  const market = await getCurrentMarket();

  return (
    <article className="overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-soft">
      <Link href={prefixMarketHref(`/packs/${pack.slug}`, market)} className="relative block aspect-[8/5] bg-warm-50">
        <Image
          src={packImages[pack.id]}
          alt={pack.nameAr}
          fill
          sizes="(min-width: 1280px) 560px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </Link>
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-olive px-3 py-1 text-xs font-black text-white">{pack.eyebrow}</span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-800">{pack.badge}</span>
        </div>
        <h3 className="text-2xl font-black leading-tight">{pack.nameAr}</h3>
        <p className="mt-2 text-sm font-black text-date">{pack.subtitleAr}</p>
        <p className="mt-3 text-sm font-bold leading-7 text-charcoal/64">{pack.descriptionAr}</p>
        <div className="mt-4 grid gap-2">
          {pack.benefits.slice(0, 2).map((benefit) => (
            <p key={benefit} className="flex gap-2 text-sm font-bold leading-7 text-charcoal/70">
              <CheckCircle2 className="mt-1 shrink-0 text-olive" size={17} />
              {benefit}
            </p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-charcoal/50">سعر المنتجين معا</p>
            <p className="text-2xl font-black">{formatMarketPrice(pack.price, market)}</p>
            <p className="text-xs font-bold text-charcoal/45 line-through">{formatMarketPrice(pack.compareAtPrice, market)} منفردة</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={prefixMarketHref(`/packs/${pack.slug}`, market)}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-charcoal/15 bg-white/70 px-4 py-3 text-sm font-bold transition hover:bg-white"
            >
              شوفي التفاصيل
              <ArrowLeft size={16} />
            </Link>
            <AddPackButton pack={pack} />
          </div>
        </div>
      </div>
    </article>
  );
}
