import { createBrowserRouter } from "react-router-dom";
import { StreaksPage } from "@/pages/streaks/StreaksPage";
import { StreakPage } from "@/pages/streak/StreakPage";

export const router = createBrowserRouter(
  [
    {
      path: "/streaks",
      element: <StreaksPage />,
    },
    {
      path: "/streak/:chatId",
      element: <StreakPage />,
    },
    {
      path: "/",
      element: <StreaksPage />,
    },
  ],
  import.meta.env.VITE_IS_PROD
    ? { basename: "/seriichik-tg-miniapp" }
    : undefined
);
