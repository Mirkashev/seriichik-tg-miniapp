/**
 * Sentry — инициализация и настройка для бесплатного тарифа.
 *
 * Шаг 1: Этот файл должен импортироваться ПЕРВЫМ в точке входа (main.tsx),
 *        чтобы перехватывать все необработанные ошибки с самого старта приложения.
 *
 * Шаг 2: Логируем только критические ошибки (которые ломают взаимодействие с приложением):
 *        - необработанные исключения (uncaught exceptions);
 *        - необработанные отклонения промисов (unhandled rejections);
 *        - ошибки рендера React (через ErrorBoundary / reactErrorHandler).
 *        Трассировка (tracing), Session Replay и прочие платные фичи отключены для экономии квоты.
 *
 * Шаг 3: Фильтрация шума через ignoreErrors и beforeSend — отсекаем ошибки расширений,
 *        ResizeObserver, сбои загрузки чанков из-за кэша и т.п., которые не блокируют юзера.
 */

import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN;
const isProd = import.meta.env.VITE_IS_PROD === "true";

// Инициализируем только если задан DSN и не в dev (опционально: можно включить и в dev для проверки)
if (dsn && typeof dsn === "string" && dsn.startsWith("https://")) {
  Sentry.init({
    dsn,

    // Окружение: в Sentry будут видны теги dev/production для фильтрации
    environment: isProd ? "production" : "development",

    // --- Экономия квоты (free tier): отключаем всё, кроме ошибок ---
    // Трассировка (performance) потребляет много событий — отключаем
    tracesSampleRate: 0,
    // Session Replay тоже отключён
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    // Отправляем 100% ошибок, прошедших фильтры ниже (фильтрация в beforeSend/ignoreErrors)
    sampleRate: 1,

    /**
     * Игнорируем сообщения, которые не являются критичными для работы приложения:
     * - ResizeObserver — известный "шум" в браузерах, не ломает UI;
     * - загрузка чанков — часто из-за старого кэша после деплоя, юзер может обновить;
     * - отмена запросов (AbortError);
     * - расширения браузера и сторонний код.
     */
    ignoreErrors: [
      /ResizeObserver loop/i,
      /ResizeObserver loop limit exceeded/i,
      /Loading chunk \d+ failed/i,
      /Loading CSS chunk \d+ failed/i,
      /ChunkLoadError/i,
      /AbortError/i,
      /Non-Error promise rejection/i,
      /Network request failed/i,
      // Расширения и сторонний код (часто в стеке есть extension:// или chrome-extension://)
      /extension:\/\//i,
      /chrome-extension:\/\//i,
    ],

    /**
     * Последний рубеж перед отправкой: можно отфильтровать или подправить событие.
     * Возврат null — событие не отправится в Sentry.
     */
    beforeSend(event, hint) {
      const error = hint.originalException;
      const message = typeof error === "object" && error && "message" in error
        ? String((error as Error).message)
        : event.message ?? "";

      // Дополнительно отсекаем по тексту, если что-то проскочило через ignoreErrors
      if (
        /ResizeObserver|ChunkLoadError|Loading chunk|AbortError|Network request failed/i.test(message)
      ) {
        return null;
      }

      return event;
    },
  });
}
