"use client";

import { Award, Headphones, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
  {
    icon: Truck,
    title: "اختيار موثوق للبيت السعودي",
    text: "أدوات عملية وليست ترندات عشوائية",
  },
  {
    icon: Award,
    title: "ضمان ذهبي 30 يوم",
    text: "راحة بعد الاستلام حسب سياسة الضمان",
  },
  {
    icon: Headphones,
    title: "تأكيد عبر اتصال هاتفي",
    text: "نتأكد أن المنتج والكمية واضحين لك",
  },
  {
    icon: ShieldCheck,
    title: "دفع عند الاستلام",
    text: "اطلبي بثقة داخل السعودية",
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
