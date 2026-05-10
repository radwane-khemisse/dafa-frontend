import type { LucideIcon } from "lucide-react";

type PolicyItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  items: PolicyItem[];
  noteTitle: string;
  noteText: string;
  noteAction?: {
    href: string;
    label: string;
  };
};

export function PolicyPage({
  eyebrow,
  title,
  intro,
  items,
  noteTitle,
  noteText,
  noteAction,
}: PolicyPageProps) {
  return (
    <main className="bg-warm-50 pb-14">
      <section className="relative overflow-hidden bg-olive py-14 text-white">
        <div className="policy-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="container-shell relative">
          <div>
            <p className="text-sm font-black text-gold">{eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-white/76 md:text-lg">
              {intro}
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell -mt-8 relative grid gap-4 md:grid-cols-3">
        {items.map(({ icon: Icon, title: itemTitle, text }, index) => (
          <article
            key={itemTitle}
            className="policy-card rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-warm-100 text-olive">
              <Icon size={22} />
            </span>
            <h2 className="mt-5 text-xl font-black text-charcoal">{itemTitle}</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-charcoal/66">{text}</p>
          </article>
        ))}
      </section>

      <section className="container-shell mt-8">
        <div className="grid gap-5 rounded-3xl bg-date p-6 text-white shadow-soft md:grid-cols-[1fr_auto] md:items-center md:p-7">
          <div>
            <p className="text-sm font-black text-gold">{noteTitle}</p>
            <p className="mt-2 max-w-3xl font-bold leading-8 text-white/78">{noteText}</p>
          </div>
          {noteAction ? (
            <a
              href={noteAction.href}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-gold px-5 py-3 text-sm font-black text-charcoal transition hover:bg-[#b98932]"
            >
              {noteAction.label}
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}
