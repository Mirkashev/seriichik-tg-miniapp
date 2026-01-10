import type { ReactNode } from 'react';

interface TelegramProviderProps {
  children: ReactNode;
}

// Telegram SDK doesn't require a provider wrapper
export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  return <>{children}</>;
};
