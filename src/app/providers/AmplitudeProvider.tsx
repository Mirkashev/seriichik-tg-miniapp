import { useEffect, type FC, type PropsWithChildren } from "react";
import { useLaunchParams } from "@tma.js/sdk-react";

export const AmplitudeProvider: FC<PropsWithChildren> = ({ children }) => {
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    import("@amplitude/analytics-browser").then((amplitude) => {
      if (cancelled) return;
      try {
        amplitude.init(import.meta.env.VITE_AMPLITUDE_ID, String(user.id), {
          autocapture: { sessions: true, pageViews: true },
        });
        amplitude.track("app_opened", { is_premium: user.isPremium });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("Amplitude init failed:", error);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return <>{children}</>;
};
