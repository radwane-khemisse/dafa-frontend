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
    nameAr: "باقة الغداء المرتب",
    eyebrow: "وفري أكثر بطلب واحد",
    subtitleAr: "قطاعة الخضار مع حافظة الأرز والحبوب",
    descriptionAr:
      "للي تطبخ رز وسلطة أو كشنة أكثر من مرة بالأسبوع: جهزي الخضار أسرع، وخلي الرز والحبوب واضحة بدل أكياس مفتوحة في الدولاب.",
    productIds: ["vegetable_cutter", "rice_dispenser"],
    offerId: "pack_pair",
    price: 318,
    compareAtPrice: 398,
    badge: "توفير 80 ريال",
    benefits: [
      "تجهزين السلطة والكشنة أسرع وتعرفين كمية الرز والحبوب قبل الطبخ",
      "طلب واحد يجمع التحضير والتخزين بدل شراء كل منتج لحاله",
      "تدفعين 318 ريال للمنتجين بدل 398 ريال إذا شريتيهم منفردين",
    ],
    useCases: ["غداء البيت", "ترتيب المؤونة", "تحضير الأسبوع"],
  },
  {
    id: "clean-counter-pack",
    slug: "clean-counter-pack",
    nameAr: "باقة المطبخ الواسع",
    eyebrow: "توفير على منتجين يكملون بعض",
    subtitleAr: "قطاعة الخضار مع منظم تجفيف الصحون",
    descriptionAr:
      "للمطبخ اللي ينزحم وقت الطبخ وبعد الغسيل: حضري المكونات بفوضى أقل، وخلي الصحون تجف فوق الحوض بدل ما تأخذ مساحة الرخام.",
    productIds: ["vegetable_cutter", "dish_drying_rack"],
    offerId: "pack_pair",
    price: 318,
    compareAtPrice: 398,
    badge: "الأفضل للمطابخ الصغيرة",
    benefits: [
      "تقللين فوضى التقطيع وفوضى الصحون في نفس روتين الطبخ",
      "اختيار عملي للبيوت اللي سطح المطبخ فيها ينزحم بسرعة",
      "توفرين 80 ريال وتستلمين المنتجين في نفس الطلب",
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
