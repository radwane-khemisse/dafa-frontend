import Image from "next/image";
import type { Product } from "@/data/products";

export type ProductImageVariant = "card" | "hero" | "usage" | "benefits";

const productImages: Record<Product["id"], Record<ProductImageVariant, string>> = {
  dish_drying_rack: {
    card: "/product-images/expandable-dish-rack-product-card.webp",
    hero: "/product-images/expandable-dish-rack-hero.webp",
    usage: "/product-images/expandable-dish-usage.webp",
    benefits: "/product-images/expandable-dish-rack-benefits.webp",
  },
  rice_dispenser: {
    card: "/product-images/rice-dispenser-product-card.webp",
    hero: "/product-images/rice-dispenser-hero.webp",
    usage: "/product-images/rice-dispenser-usage.webp",
    benefits: "/product-images/rice-dispenser-benefits.webp",
  },
  vegetable_cutter: {
    card: "/product-images/vegetabales-cutter-product-card.webp",
    hero: "/product-images/vegetabales-cutter-hero-section.webp",
    usage: "/product-images/vegetables-cutter-usage-section.webp",
    benefits: "/product-images/vegetable-cutter-benefits.webp",
  },
  mini_portable_blender: {
    card: "/product-images/mini-portable-blender-product-card.webp",
    hero: "/product-images/mini-portable-blender-hero.webp",
    usage: "/product-images/mini-portable-blender-usage.webp",
    benefits: "/product-images/mini-portable-blender-benefits.webp",
  },
};

export const packImages: Record<string, string> = {
  "prep-and-storage-pack": "/product-images/pack-prep-storage.webp",
  "clean-counter-pack": "/product-images/pack-clean-counter.webp",
};

export function ProductVisual({
  product,
  label = "صورة المنتج",
  className = "",
  compact = false,
  ratio = "auto",
  variant = "card",
  priority = false,
}: {
  product: Product;
  label?: string;
  className?: string;
  compact?: boolean;
  ratio?: "auto" | "square" | "wide";
  variant?: ProductImageVariant;
  priority?: boolean;
}) {
  const frameClass = compact
    ? "min-h-20"
    : ratio === "square"
      ? "aspect-square min-h-0"
      : ratio === "wide"
        ? "aspect-[5/4] min-h-0"
        : "min-h-[280px]";

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-warm-50 shadow-soft ${frameClass} ${className}`} role="img" aria-label={`${label}: ${product.nameAr}`}>
      <Image
        src={productImages[product.id][variant]}
        alt={`${label}: ${product.nameAr}`}
        fill
        priority={priority}
        sizes={compact ? "(min-width: 640px) 280px, 50vw" : ratio === "square" ? "(min-width: 1024px) 520px, 100vw" : "(min-width: 1024px) 560px, 100vw"}
        className="object-cover"
      />
    </div>
  );
}

export function KitchenHeroVisual() {
  return (
    <div className="relative aspect-[5/4] min-h-60 overflow-hidden rounded-3xl bg-warm-50 shadow-soft sm:min-h-80" aria-label="منتجات مطبخ دفا">
      <Image
        src="/product-images/dafakitchen-home-hero.webp"
        alt="منتجات مطبخ دفا على سطح مطبخ مرتب"
        fill
        priority
        sizes="(min-width: 1024px) 540px, 100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap justify-center gap-2 sm:inset-x-8 sm:bottom-8">
        {["تحضير أسرع", "مؤونة أرتب", "حوض أنظف"].map((label) => (
          <span key={label} className="rounded-full bg-olive px-4 py-2 text-xs font-black text-white shadow-soft">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
