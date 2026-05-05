export type NormalizedPhone = {
  e164: string;
  digits: string;
};

export function normalizeKsaPhone(input: string): NormalizedPhone | null {
  let digits = input.replace(/\D/g, "");

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

  if (!/^9665\d{8}$/.test(digits)) {
    return null;
  }

  const local = digits.slice(3);
  if (new Set(local.split("")).size <= 2) {
    return null;
  }

  return { e164: `+${digits}`, digits };
}

