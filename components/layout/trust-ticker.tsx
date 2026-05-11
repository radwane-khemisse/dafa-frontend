"use client";

import { Award, Headphones, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
  {
    icon: Truck,
    title: "عروض أوفر للبيت السعودي",
    text: "قطعة، قطعتين، أو باقة حسب احتياجك",
  },
  {
    icon: Award,
    title: "ضمان ذهبي 30 يوم",
    text: "راحة بعد الاستلام حسب سياسة الضمان",
  },
  {
    icon: Headphones,
    title: "تأكيد قبل الشحن",
    text: "نراجع المنتج والكمية والعنوان",
  },
  {
    icon: ShieldCheck,
    title: "الدفع عند الاستلام",
    text: "بدون دفع مسبق داخل السعودية",
  },
];

export function TrustTicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = messages[activeIndex];
  const Icon = active.icon;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % messages.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="border-b border-charcoal/10 bg-gradient-to-l from-[#E5D8C4] via-[#FAF7EF] to-[#DEE7D6]">
      <div className="container-shell flex min-h-14 items-center justify-center py-3">
        <div className="flex min-w-0 items-center justify-center gap-3 text-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal text-gold shadow-soft">
            <Icon size={20} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-charcoal md:text-base">{active.title}</p>
            <p className="truncate text-xs font-semibold text-charcoal/60">{active.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
