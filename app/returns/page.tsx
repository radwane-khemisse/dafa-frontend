import { Camera, Mail, PackageSearch, RotateCcw } from "lucide-react";
import { PolicyPage } from "@/components/policy/policy-page";

export default function ReturnsPage() {
  return (
    <PolicyPage
      eyebrow="الاستبدال والاسترجاع"
      title="نراجع المشكلة بصورة واضحة ونساعدك بخطوة مرتبة"
      intro="اختيارات دفا عملية وواضحة، ومع ذلك إذا وصلك المنتج بتلف ظاهر أو عيب مصنعي نراجع الحالة بهدوء ونوضح لك الإجراء المناسب."
      items={[
        {
          icon: PackageSearch,
          title: "متى نقبل المراجعة؟",
          text: "نوفر استبدال المنتج عند وجود عيب مصنعي أو تلف واضح عند الاستلام، بعد مراجعة الصور وبيانات الطلب.",
        },
        {
          icon: Camera,
          title: "أرسلي الصور خلال 24 ساعة",
          text: "يرجى إرسال صورة واضحة للمنتج، صورة للطلب أو الفاتورة، ووصف قصير للمشكلة خلال 24 ساعة من الاستلام.",
        },
        {
          icon: Mail,
          title: "إرسال الصور",
          text: "ترسل الصور وبيانات الطلب إلى البريد support@dafakitchen.shop حتى يراجعها فريق الدعم في مكان واحد.",
        },
        {
          icon: RotateCcw,
          title: "إجراء مناسب للحالة",
          text: "بعد المراجعة نوضح لك هل الحالة مناسبة للاستبدال أو تحتاج معلومات إضافية، حسب حالة المنتج وسياسة الدفع عند الاستلام.",
        },
      ]}
      noteTitle="أين أرسل الصور؟"
      noteText="للاستبدال أو مراجعة التلف، أرسلي الصور ورقم الطلب إلى support@dafakitchen.shop خلال 24 ساعة من الاستلام."
      noteAction={{
        href: "mailto:support@dafakitchen.shop",
        label: "إرسال الصور بالبريد",
      }}
    />
  );
}
