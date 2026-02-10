/**
 * Приводит строку к корректному UTF-16 (заменяет lone surrogates на U+FFFD).
 * Данные из API/Telegram могут содержать невалидные последовательности и вызывать
 * "String contained an illegal UTF-16 sequence" при encodeURIComponent и в DOM.
 * Использует нативный toWellFormed() (ES2024), в TG Mini App движок обычно современный.
 */
export function sanitizeUtf16(value: string | undefined | null): string {
  if (value == null || typeof value !== "string") return "";
  return (value as string & { toWellFormed(): string }).toWellFormed();
}
