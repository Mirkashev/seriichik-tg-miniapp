/**
 * Создает fallback URL для аватара на основе имени пользователя
 * Используется когда фото недоступно
 */
export const getAvatarFallback = (name?: string): string => {
  // Можно использовать сервис для генерации аватаров по инициалам
  // Например: https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=128`;
};
