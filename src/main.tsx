import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryProvider } from "./app/providers/QueryProvider";
import { TelegramProvider } from "./app/providers/TelegramProvider";
import { router } from "./app/router/router";
import "@/shared/styles/index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TelegramProvider>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          visibleToasts={3}
          duration={3000}
          expand={false}
        />
      </QueryProvider>
    </TelegramProvider>
  </StrictMode>
);
