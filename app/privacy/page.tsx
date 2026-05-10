import { BadgeCheck, LockKeyhole, Megaphone, Smartphone } from "lucide-react";
import { PolicyPage } from "@/components/policy/policy-page";

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="الخصوصية"
      title="بياناتك لخدمة الطلب، وليست للبيع"
      intro="نتعامل مع بيانات العميل باعتبارها جزءا من تجربة طلب موثوقة: نستخدمها للتأكيد، الشحن، وخدمة ما بعد الطلب فقط بالقدر اللازم."
      items={[
        {
          icon: Smartphone,
          title: "بيانات الطلب",
          text: "نستخدم بيانات الطلب لتأكيد طلبات الدفع عند الاستلام وتجهيز الشحن وخدمة العملاء.",
        },
        {
          icon: Megaphone,
          title: "تحسين الإعلانات",
          text: "قد نستخدم أدوات قياس إعلاني مثل Meta وTikTok وSnapchat لتحسين الإعلانات عند تفعيل التكاملات.",
        },
        {
          icon: LockKeyhole,
          title: "بيانات مشفرة",
          text: "عند إرسال بيانات المطابقة للسيرفر، تتم معالجتها بشكل مشفر أو مجزأ حسب إعدادات التكاملات الإعلانية.",
        },
        {
          icon: BadgeCheck,
          title: "لا نبيع بياناتك",
          text: "لا نبيع بيانات العملاء. رقم الجوال يستخدم للتأكيد والتوصيل والمتابعة المتعلقة بالطلب.",
        },
      ]}
      noteTitle="تعهد مطبخ دفا"
      noteText="نحافظ على وضوح استخدام البيانات ونبقيها مرتبطة بتجربة الطلب، التأكيد، التوصيل، وخدمة العميل."
    />
  );
}
