import { useEffect } from "react";
import type { ReactNode } from "react";
import {
  viewport,
  init,
  swipeBehavior,
  postEvent,
  retrieveLaunchParams,
} from "@tma.js/sdk";

interface TelegramProviderProps {
  children: ReactNode;
}

try {
  init();
} catch (error: unknown) {
  console.warn("Failed to initialize Telegram SDK:", error);
}

const MOBILE_PLATFORMS = new Set(["android", "android_x", "ios"]);

function isMobilePlatform(): boolean {
  try {
    const { tgWebAppPlatform } = retrieveLaunchParams();
    return MOBILE_PLATFORMS.has(tgWebAppPlatform);
  } catch {
    return false;
  }
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  useEffect(() => {
    const isMobile = isMobilePlatform();

    const initializeViewport = async () => {
      try {
        if (!viewport.isMounted()) {
          await viewport.mount();
          swipeBehavior.mount();
        }

        postEvent("web_app_set_background_color", { color: "#f8f8f8" });
        postEvent("web_app_set_header_color", { color: "#ffd179" });

        if (isMobile) {
          viewport.expand();

          setTimeout(async () => {
            try {
              await viewport.requestFullscreen();
              swipeBehavior.disableVertical();
            } catch (error: unknown) {
              console.warn("Failed to request fullscreen:", error);
            }
          });
        } else if (viewport.isFullscreen()) {
          await viewport.exitFullscreen();
        }
      } catch (error: unknown) {
        console.warn("Failed to initialize viewport:", error);
      }
    };

    initializeViewport();
  }, []);

  return <>{children}</>;
};
