import { useEffect, type FC, type PropsWithChildren } from "react"
import * as amplitude from '@amplitude/analytics-browser';
import { useLaunchParams } from "@tma.js/sdk-react";

export const AmplitudeProvider: FC<PropsWithChildren> = ({ children }) => {
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;

  useEffect(() => {
    if (user) {
      try {
        amplitude.init(import.meta.env.VITE_AMPLITUDE_ID,
          String(user.id),
          {
            autocapture: { sessions: true, pageViews: true }
          }
        );

        amplitude.track('app_opened', { is_premium: user.isPremium });
      } catch (error) {
        console.log(error)
      }

    }
  }, [user])

  return children;
}