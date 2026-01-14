import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import mkcert from "vite-plugin-mkcert";
// @ts-expect-error - vite-plugin-eruda has typing issues with exports
import eruda from "vite-plugin-eruda";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      server: {
        // host: "localhost",
        allowedHosts: ["866ac3ffef11.ngrok-free.app"],
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
    return {
      base: "/seriichik-tg-miniapp/",
      plugins: [react(), svgr({ include: "**/*.svg?svgr" })],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }
});
