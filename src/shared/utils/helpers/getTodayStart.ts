import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Расширяем dayjs плагинами для работы с timezone
dayjs.extend(utc);
dayjs.extend(timezone);

export const getTodayStart = (timeZone?: string | null): Date => {
  try {
    if (!timeZone) {
      return dayjs.utc().startOf("day").toDate();
    }

    return dayjs.utc().tz(timeZone).startOf("day").toDate();
  } catch (error) {
    console.warn(
      `Failed to parse timezone ${timeZone}, falling back to UTC:`,
      error
    );
    return dayjs.utc().startOf("day").toDate();
  }
}