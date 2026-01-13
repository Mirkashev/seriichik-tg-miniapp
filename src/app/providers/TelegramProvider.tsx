import { useEffect } from "react";
import type { ReactNode } from "react";
import { viewport, init, swipeBehavior, postEvent } from "@tma.js/sdk";

interface TelegramProviderProps {
  children: ReactNode;
}

init();

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  useEffect(() => {
    const initializeViewport = async () => {
      try {
        if (!viewport.isMounted()) {
          await viewport.mount();
          swipeBehavior.mount();
        }

        viewport.expand();

        postEvent("web_app_set_background_color", { color: "#f8f8f8" });
        postEvent("web_app_set_header_color", { color: "#ffd179" });

        setTimeout(async () => {
          try {
            await viewport.requestFullscreen();
            swipeBehavior.disableVertical();
          } catch (error: unknown) {
            console.warn("Failed to request fullscreen:", error);
          }
        });
      } catch (error: unknown) {
        // Игнорируем ошибки, если fullscreen недоступен или viewport не может быть смонтирован
        console.warn("Failed to initialize viewport:", error);
      }
    };

    initializeViewport();
  }, []);

  return <>{children}</>;
};
