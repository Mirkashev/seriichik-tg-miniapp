// Инициализация Sentry — обязательно первым импортом, чтобы перехватывать ошибки с самого старта
import "./instrument";

import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryProvider } from "./app/providers/QueryProvider";
import { TelegramProvider } from "./app/providers/TelegramProvider";
import { router } from "./app/router/router";
import "@/shared/styles/index.scss";
import { AmplitudeProvider } from "./app/providers/AmplitudeProvider";

const root = createRoot(document.getElementById("root")!, {
  // React 19: отправляем в Sentry необработанные и восстановимые ошибки рендера
  onUncaughtError: Sentry.reactErrorHandler(),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error }) => (
        <div style={{ padding: 16, textAlign: "center" }}>
          <p>Что-то пошло не так. Попробуйте обновить страницу.</p>
          {import.meta.env.DEV && (
            <pre>{error instanceof Error ? error.message : String(error)}</pre>
          )}
        </div>
      )}
    >
      <TelegramProvider>
        <AmplitudeProvider>
          <QueryProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-center"
              visibleToasts={3}
              duration={3000}
              expand={false}
            />
          </QueryProvider>
        </AmplitudeProvider>
      </TelegramProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>
);
