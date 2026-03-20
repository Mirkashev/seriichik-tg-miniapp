import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/app/layout/RootLayout";
import { Loader } from "@/shared/ui/Loader";

const StreaksPage = lazy(() => import("@/pages/streaks/StreaksPage").then((m) => ({ default: m.StreaksPage })));
const StreakPage = lazy(() => import("@/pages/streak/StreakPage").then((m) => ({ default: m.StreakPage })));
const TestPage = lazy(() => import("@/pages/test/TestPage").then((m) => ({ default: m.TestPage })));

const PageFallback = (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <Loader />
  </div>
);

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={PageFallback}>
              <StreaksPage />
            </Suspense>
          ),
        },
        {
          path: "streaks",
          element: (
            <Suspense fallback={PageFallback}>
              <StreaksPage />
            </Suspense>
          ),
        },
        {
          path: "streak/:chatId",
          element: (
            <Suspense fallback={PageFallback}>
              <StreakPage />
            </Suspense>
          ),
        },
        {
          path: "test",
          element: (
            <Suspense fallback={PageFallback}>
              <TestPage />
            </Suspense>
          ),
        },
      ],
    },
  ],
  import.meta.env.VITE_IS_PROD
    ? { basename: "/seriichik-tg-miniapp" }
    : undefined
);
