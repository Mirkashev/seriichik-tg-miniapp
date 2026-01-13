import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// @ts-expect-error - vite-plugin-eruda has typing issues with exports
import eruda from "vite-plugin-eruda";
import svgr from "vite-plugin-svgr";
import path from "path";

// @ts-expect-error - vite-plugin-eruda has typing issues with exports
export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      server: {
        // https: true,
        // host: "localhost",
        allowedHosts: ["9966a0534464.ngrok-free.app"],
      },
      plugins: [
        react(),
        // mkcert(),
        eruda(), // Инициализирует Eruda для отладки в мини-аппе
        svgr({ include: "**/*.svg?svgr" }),
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  } else {
    // Production config (vite build)
    return {
      base: "/seriichik-tg-miniapp/",
      plugins: [react(), mkcert(), svgr({ include: "**/*.svg?svgr" })],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }
});
