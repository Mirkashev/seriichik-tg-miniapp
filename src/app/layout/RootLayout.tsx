import { Outlet } from "react-router-dom";
import { TelegramStartParamProvider } from "@/app/providers/TelegramStartParamProvider";

export const RootLayout = () => (
  <TelegramStartParamProvider>
    <Outlet />
  </TelegramStartParamProvider>
);
