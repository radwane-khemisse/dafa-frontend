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
}: {
  product: Product;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const description = imageDescriptions[product.id];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dashed border-charcoal/25 bg-warm-50 shadow-soft ${
        compact ? "min-h-20" : "min-h-[280px]"
      } ${className}`}
      role="img"
      aria-label={`${label}: ${product.nameAr}`}
    >
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center text-center ${
          compact ? "min-h-20 p-2" : "min-h-[280px] p-8"
        }`}
      >
        <p className={`max-w-md font-black text-charcoal/55 ${compact ? "text-[10px] leading-5" : "text-base leading-8"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

export function KitchenHeroVisual() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-label="منتجات مطبخ دفا">
      <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-charcoal/25 bg-warm-50 p-5 text-center shadow-soft sm:col-span-2">
        <p className="max-w-md text-base font-black leading-8 text-charcoal/55">
          [صورة هيرو لمطبخ دفا تعرض قطاعة الخضار وحافظة الأرز والحبوب ومنظم الصحون على سطح مطبخ سعودي مرتب]
        </p>
      </div>
      <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-charcoal/25 bg-warm-50 p-5 text-center">
        <p className="text-sm font-black leading-7 text-charcoal/55">[صورة قريبة لحافظة الأرز والحبوب داخل الدولاب]</p>
      </div>
      <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-charcoal/25 bg-warm-50 p-5 text-center">
        <p className="text-sm font-black leading-7 text-charcoal/55">[صورة منظم تجفيف الصحون فوق الحوض بعد غسل الأطباق]</p>
      </div>
    </div>
  );
}
