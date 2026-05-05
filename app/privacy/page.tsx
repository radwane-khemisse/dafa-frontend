export default function PrivacyPage() {
  return <Policy title="سياسة الخصوصية" paragraphs={[
    "نستخدم بيانات الطلب لتأكيد طلبات الدفع عند الاستلام وتجهيز الشحن وخدمة العملاء.",
    "قد نستخدم أدوات قياس إعلاني مثل Meta وTikTok وSnapchat لتحسين الإعلانات. يتم إرسال بيانات المطابقة للسيرفر بشكل مشفر/مجزأ عند تفعيل التكاملات.",
    "لا نبيع بيانات العملاء. رقم الجوال يستخدم للتأكيد والتوصيل والمتابعة المتعلقة بالطلب."
  ]} />;
}

function Policy({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <section className="container-shell py-14">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-soft">
        <h1 className="text-4xl font-black">{title}</h1>
        <div className="mt-6 grid gap-4 leading-8 text-charcoal/70">
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

