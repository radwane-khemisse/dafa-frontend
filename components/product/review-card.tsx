import { Star } from "lucide-react";

export function ReviewCard({ name, city, text }: { name: string; city: string; text: string }) {
  const initial = name.trim().replace(/^أم\s+/, "").charAt(0) || name.charAt(0);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-5 shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-gold via-clay to-sage" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-warm-200 to-gold text-xl font-black text-date shadow-soft">
            {initial}
          </div>
          <div>
            <p className="font-black">{name}</p>
            <p className="mt-1 text-xs font-bold text-charcoal/55">{city}</p>
          </div>
        </div>
        <span className="rounded-full bg-warm-100 px-3 py-1 text-[11px] font-black text-olive">تجربة عميلة</span>
      </div>

      <div className="mt-5 flex items-center gap-1 text-gold">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} size={16} className="fill-gold" />
        ))}
        <span className="me-2 text-xs font-black text-charcoal/50">5.0</span>
      </div>

      <p className="mt-4 text-sm leading-8 text-charcoal/75">"{text}"</p>
    </div>
  );
}
