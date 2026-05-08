import type { Product } from "@/data/products";

const imageDescriptions = {
  dish_drying_rack: "[صورة منظم تجفيف الصحون المعدني القابل للتعديل فوق الحوض مع صحون وأكواب مرتبة والماء ينزل داخل الحوض]",
  rice_dispenser: "[صورة حافظة أرز وحبوب دوارة محكمة داخل دولاب مطبخ مرتب مع كوب قياس]",
  vegetable_cutter: "[صورة قطاعة خضار 14 في 1 مع الحافظة أثناء تحضير السلطة والكشنة]",
};

export function ProductVisual({
  product,
  label = "صورة المنتج",
  className = "",
  compact = false,
  ratio = "auto",
}: {
  product: Product;
  label?: string;
  className?: string;
  compact?: boolean;
  ratio?: "auto" | "square" | "wide";
}) {
  const description = imageDescriptions[product.id];
  const frameClass = compact
    ? "min-h-20"
    : ratio === "square"
      ? "aspect-square min-h-0"
      : ratio === "wide"
        ? "aspect-[5/4] min-h-0"
        : "min-h-[280px]";
  const contentClass = compact
    ? "min-h-20 p-2"
    : ratio === "auto"
      ? "min-h-[280px] p-8"
      : "h-full p-8";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dashed border-charcoal/25 bg-warm-50 shadow-soft ${frameClass} ${className}`}
      role="img"
      aria-label={`${label}: ${product.nameAr}`}
    >
      <div className={`relative z-10 flex h-full flex-col items-center justify-center text-center ${contentClass}`}>
        <p className={`max-w-md font-black text-charcoal/55 ${compact ? "text-[10px] leading-5" : "text-base leading-8"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

export function KitchenHeroVisual() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-charcoal/25 bg-warm-50 p-4 shadow-soft" aria-label="منتجات مطبخ دفا">
      <div className="flex aspect-[5/4] min-h-80 items-center justify-center rounded-2xl bg-white p-6 text-center">
        <p className="max-w-lg text-base font-black leading-8 text-charcoal/55">
          [صورة هيرو لمطبخ دفا تعرض قطاعة الخضار وحافظة الأرز والحبوب ومنظم الصحون على سطح مطبخ سعودي مرتب]
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-8 bottom-8 flex flex-wrap justify-center gap-2">
        {["تحضير أسرع", "مؤونة أرتب", "حوض أنظف"].map((label) => (
          <span key={label} className="rounded-full bg-olive px-4 py-2 text-xs font-black text-white shadow-soft">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
