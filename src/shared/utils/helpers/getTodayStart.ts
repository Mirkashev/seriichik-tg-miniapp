export const getTodayStart = (timeZone?: string | null): Date => {
  const now = new Date();

  if (!timeZone) {
    // Fallback на GMT+0 если timezone не указан
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
  }

  try {
    // Получаем текущую дату в указанном timezone в формате YYYY-MM-DD
    const dateString = now.toLocaleDateString("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }); // Формат: YYYY-MM-DD

    // Парсим компоненты даты
    const [year, month, day] = dateString.split("-").map(Number);

    // Создаём начало дня в целевом timezone
    // Трюк: создаем дату в локальном времени, затем конвертируем в UTC с учетом offset
    const localDateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`;

    // Получаем этот момент времени в формате UTC
    // Создаем временную дату и получаем её представление в нужном timezone
    const tempDate = new Date(localDateString);
    const tzDateString = tempDate.toLocaleString("en-US", { timeZone });
    const utcDateString = tempDate.toLocaleString("en-US", {
      timeZone: "UTC",
    });

    // Вычисляем разницу
    const tzTime = new Date(tzDateString).getTime();
    const utcTime = new Date(utcDateString).getTime();
    const offset = tzTime - utcTime;

    // Создаем правильную дату начала дня
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    return new Date(startOfDay.getTime() - offset);
  } catch (error) {
    console.warn(
      `Failed to parse timezone ${timeZone}, falling back to GMT+0:`,
      error
    );
    // Fallback на GMT+0 при ошибке
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
  }
};
