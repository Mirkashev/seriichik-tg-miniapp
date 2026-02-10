/** Заменяет одиночные суррогаты на U+FFFD (fallback для старых браузеров без toWellFormed). */
function sanitizeUtf16Fallback(s: string): string {
  return s.replace(
    /([\uD800-\uDBFF])([\uDC00-\uDFFF])|[\uD800-\uDFFF]/g,
    (m, high, low) => (high && low ? m : "\uFFFD")
  );
}

/**
 * Приводит строку к корректному UTF-16 (заменяет lone surrogates на U+FFFD).
 * Данные из API/Telegram (имена, никнеймы, имена питомцев) могут содержать
 * невалидные последовательности и вызывать "String contained an illegal UTF-16
 * sequence" при encodeURIComponent и в DOM. Используется для всех полей из API.
 */
export function sanitizeUtf16(value: string | undefined | null): string {
  if (value == null || typeof value !== "string") return "";
  const str = value as string & { toWellFormed?(): string };
  return typeof str.toWellFormed === "function" ? str.toWellFormed() : sanitizeUtf16Fallback(value);
}
