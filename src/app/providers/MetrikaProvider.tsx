import { useLaunchParams } from '@tma.js/sdk-react';
import { useEffect, type PropsWithChildren } from 'react';


export const MetrikaProvider = ({ children }: PropsWithChildren) => {
  const launchParams = useLaunchParams(true);
  const user = launchParams.tgWebAppData?.user;

  useEffect(() => {
    // Открытие приложения
    if (user?.id) {
      try {
        ym(106770151, 'setUserID', user.id.toString());

        ym(106770151, 'params', {
          type: 'app_opened',
        });
      } catch (error) {
        console.log(error)
      }
    }
  }, [user?.id])

  return children;
};
