import { sanitizeUtf16 } from "./sanitizeUtf16";

/**
 * Создает fallback URL для аватара на основе имени пользователя
 * Используется когда фото недоступно
 */
export const getAvatarFallback = (name?: string): string => {
  const safeName = sanitizeUtf16(name);
  const initials =
    safeName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=128`;
};
