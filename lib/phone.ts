export type NormalizedPhone = {
  e164: string;
  digits: string;
};

export type PhoneValidationResult =
  | { ok: true; phone: NormalizedPhone }
  | { ok: false; message: string };

type PhoneMarket = {
  code: string;
  countryNameEn: string;
  countryNameAr?: string;
  phoneCountryCode: string;
  localPhoneDigits: number;
};

type PhoneRule = {
  localPattern: RegExp;
  example: string;
  prefixes: string;
  localLength: number;
};

const phoneRules: Record<string, PhoneRule> = {
  ksa: { localPattern: /^5\d{8}$/, example: "05XXXXXXXX", prefixes: "5 أو 05 أو 9665", localLength: 9 },
  kwt: { localPattern: /^(?:41|5|6|9)\d{6}$/, example: "5XXXXXXX", prefixes: "41 أو 5 أو 6 أو 9", localLength: 8 },
  uae: { localPattern: /^5\d{8}$/, example: "05XXXXXXXX", prefixes: "05 أو 9715", localLength: 9 },
  qat: { localPattern: /^[3567]\d{7}$/, example: "5XXXXXXX", prefixes: "3 أو 5 أو 6 أو 7", localLength: 8 },
  bhr: { localPattern: /^3\d{7}$/, example: "3XXXXXXX", prefixes: "3", localLength: 8 },
  omn: { localPattern: /^[79]\d{7}$/, example: "9XXXXXXX", prefixes: "7 أو 9", localLength: 8 },
};

export function normalizeKsaPhone(input: string): NormalizedPhone | null {
  const result = validateKsaPhone(input);
  return result.ok ? result.phone : null;
}

export function phoneExampleForMarket(marketCode: string) {
  return (phoneRules[marketCode] ?? phoneRules.ksa).example;
}

export function validateGulfPhone(input: string, market: PhoneMarket): PhoneValidationResult {
  const rule = phoneRules[market.code] ?? phoneRules.ksa;
  const countryName = market.countryNameAr || market.countryNameEn;
  const prefix = market.phoneCountryCode;
  let digits = input.replace(/\D/g, "");

  if (!digits) {
    return { ok: false, message: `اكتبي رقم جوال ${countryName}، مثال: ${rule.example}.` };
  }

  if (digits.startsWith(`00${prefix}`)) {
    digits = digits.slice(2);
  }
  if (digits.startsWith(`${prefix}0`)) {
    digits = `${prefix}${digits.slice(prefix.length + 1)}`;
  } else if (digits.startsWith("0") && digits.length === rule.localLength + 1) {
    digits = `${prefix}${digits.slice(1)}`;
  } else if (digits.length === rule.localLength) {
    digits = `${prefix}${digits}`;
  }

  if (!digits.startsWith(prefix)) {
    return {
      ok: false,
      message: `هذا يبدو رقم بلد آخر. لطلبات ${countryName} اكتبي الرقم بصيغة ${rule.example} أو +${prefix}${rule.example.replace(/^0/, "")}.`,
    };
  }

  const local = digits.slice(prefix.length);
  if (local.length < rule.localLength) {
    return {
      ok: false,
      message: `باقي ${rule.localLength - local.length} رقم. رقم جوال ${countryName} يكون ${rule.localLength} أرقام بدون رمز الدولة، مثال: ${rule.example}.`,
    };
  }

  if (local.length > rule.localLength) {
    return {
      ok: false,
      message: `الرقم أطول من المطلوب. رقم جوال ${countryName} يكون ${rule.localLength} أرقام بدون رمز الدولة، مثال: ${rule.example}.`,
    };
  }

  if (!rule.localPattern.test(local)) {
    return {
      ok: false,
      message: `بداية الرقم غير مناسبة لـ ${countryName}. رقم الجوال يبدأ عادة بـ ${rule.prefixes}، مثال: ${rule.example}.`,
    };
  }

  if (new Set(local.split("")).size <= 2) {
    return { ok: false, message: "الرقم يبدو غير صحيح. اكتبي رقم جوال تستقبلين عليه مكالمة تأكيد الطلب." };
  }

  return { ok: true, phone: { e164: `+${digits}`, digits } };
}

export function validateKsaPhone(input: string): PhoneValidationResult {
  return validateGulfPhone(input, {
    code: "ksa",
    countryNameEn: "Saudi Arabia",
    countryNameAr: "السعودية",
    phoneCountryCode: "966",
    localPhoneDigits: 9,
  });
}
