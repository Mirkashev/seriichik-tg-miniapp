import { createBrowserRouter } from "react-router-dom";
import { StreaksPage } from "@/pages/streaks/StreaksPage";
import { StreakPage } from "@/pages/streak/StreakPage";
import { TestPage } from "@/pages/test/TestPage";

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
      path: "/test",
      element: <TestPage />,
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
