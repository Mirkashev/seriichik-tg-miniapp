/**
 * Отправка события в Amplitude через динамический импорт.
 * Не тянет чанк @amplitude/analytics-browser в начальную загрузку.
 */
export function trackAmplitude(
  eventName: string,
  props?: Record<string, unknown>
): void {
  import("@amplitude/analytics-browser").then((amp) => {
    amp.track(eventName, props);
  });
}
