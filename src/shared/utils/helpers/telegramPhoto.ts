import { sanitizeUtf16 } from "./sanitizeUtf16";

/**
 * Создает fallback URL для аватара на основе имени пользователя
 * Используется когда фото недоступно
 */
export const getAvatarFallback = (name?: string): string => {
  const safeName = sanitizeUtf16(name);
  const rawInitials =
    safeName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  const initials = sanitizeUtf16(rawInitials) || "?";

  try {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=128`;
  } catch {
    return `https://ui-avatars.com/api/?name=?&background=random&size=128`;
  }
};
