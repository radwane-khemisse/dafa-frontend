export type NormalizedPhone = {
  e164: string;
  digits: string;
};

export type PhoneValidationResult =
  | { ok: true; phone: NormalizedPhone }
  | { ok: false; message: string };

export function normalizeKsaPhone(input: string): NormalizedPhone | null {
  const result = validateKsaPhone(input);
  return result.ok ? result.phone : null;
}

export function validateKsaPhone(input: string): PhoneValidationResult {
  let digits = input.replace(/\D/g, "");

  if (!digits) {
    return { ok: false, message: "اكتبي رقم الجوال، مثال: 05XXXXXXXX أو 9665XXXXXXXX." };
  }

  if (digits.startsWith("00966")) {
    digits = digits.slice(2);
  }
  if (digits.startsWith("9660")) {
    digits = `966${digits.slice(4)}`;
  } else if (digits.startsWith("05")) {
    digits = `966${digits.slice(1)}`;
  } else if (digits.startsWith("5")) {
    digits = `966${digits}`;
  }

  if (!digits.startsWith("9665")) {
    return { ok: false, message: "رقم الجوال السعودي لازم يبدأ بـ 5 أو 05 أو 9665." };
  }

  if (digits.length < 12) {
    return { ok: false, message: `باقي ${12 - digits.length} رقم. اكتبي الرقم كامل مثل 05XXXXXXXX.` };
  }

  if (digits.length > 12) {
    return { ok: false, message: "الرقم أطول من المطلوب. اكتبي رقم جوال سعودي من 9 أرقام بعد 05." };
  }

  if (!/^9665\d{8}$/.test(digits)) {
    return { ok: false, message: "استخدمي أرقام فقط بصيغة 05XXXXXXXX أو 9665XXXXXXXX." };
  }

  const local = digits.slice(3);
  if (new Set(local.split("")).size <= 2) {
    return { ok: false, message: "الرقم يبدو غير صحيح. اكتبي رقم جوال تستخدمينه لاستلام اتصال التأكيد." };
  }

  return { ok: true, phone: { e164: `+${digits}`, digits } };
}
