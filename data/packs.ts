import { getProductById, type OfferId, type Product } from "@/data/products";

export type Pack = {
  id: string;
  slug: string;
  nameAr: string;
  eyebrow: string;
  subtitleAr: string;
  descriptionAr: string;
  productIds: Product["id"][];
  offerId: OfferId;
  price: number;
  compareAtPrice: number;
  badge: string;
  benefits: string[];
  useCases: string[];
};

export const packs: Pack[] = [
  {
    id: "prep-and-storage-pack",
    slug: "prep-and-storage-pack",
    nameAr: "باقة التحضير والمؤونة",
    eyebrow: "باقة ذكية للطبخ اليومي",
    subtitleAr: "قطاعة الخضار مع حافظة الأرز والحبوب",
    descriptionAr:
      "للي تبغى تختصر وقت الغداء من البداية: تحضير أسرع للخضار، ومؤونة واضحة بدل الأكياس المفتوحة في الدولاب.",
    productIds: ["vegetable_cutter", "rice_dispenser"],
    offerId: "pack_pair",
    price: 318,
    compareAtPrice: 398,
    badge: "توفير 80 ريال",
    benefits: [
      "تجهزين السلطة والكشنة أسرع وتعرفين كمية الأرز والحبوب قبل الطبخ",
      "باقة مناسبة للروتين اليومي لأنها تجمع التحضير والترتيب في طلب واحد",
      "منتجان واضحان وسهلان للتأكيد عبر الاتصال قبل الشحن",
    ],
    useCases: ["وقت الغداء", "ترتيب دولاب المؤونة", "تحضير الأسبوع"],
  },
  {
    id: "clean-counter-pack",
    slug: "clean-counter-pack",
    nameAr: "باقة السطح المرتب",
    eyebrow: "باقة تقلل الفوضى بعد الطبخ",
    subtitleAr: "قطاعة الخضار مع منظم تجفيف الصحون",
    descriptionAr:
      "للمطبخ اللي ينزحم وقت الطبخ وبعد الغسيل: حضري المكونات بفوضى أقل، وخلي الصحون تجف فوق الحوض بدل الرخام.",
    productIds: ["vegetable_cutter", "dish_drying_rack"],
    offerId: "pack_pair",
    price: 318,
    compareAtPrice: 398,
    badge: "أفضل قيمة للسطح",
    benefits: [
      "تقللين فوضى التقطيع وفوضى الصحون في نفس روتين الطبخ",
      "اختيار عملي للبيوت اللي سطح المطبخ فيها ينزحم بسرعة",
      "يرفع قيمة الطلب بمنتجين يخدمون نفس لحظة الاستخدام",
    ],
    useCases: ["بعد الغسيل", "تحضير السلطة", "سطح مطبخ أوسع"],
  },
];

export function getPackBySlug(slug: string) {
  return packs.find((pack) => pack.slug === slug);
}

export function getPackProducts(pack: Pack) {
  return pack.productIds.map((id) => getProductById(id)).filter(Boolean) as Product[];
}
