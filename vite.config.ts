import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// @ts-expect-error - vite-plugin-eruda has typing issues with exports
import eruda from "vite-plugin-eruda";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "seriichik-tg-miniapp",
  server: {
    // @ts-expect-error - vite-plugin-mkcert handles https: true
    https: true, // Включает HTTPS
    host: "localhost",
  },
  plugins: [
    react(),
    mkcert(),
    eruda(), // Инициализирует Eruda для отладки в мини-аппе
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
