import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// @ts-expect-error - vite-plugin-eruda has typing issues with exports
import eruda from "vite-plugin-eruda";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (command === "serve") {
    return {
      server: {
        host: "localhost",
        // allowedHosts: ["14ed6005c7b7.ngrok-free.app"],
        proxy: {
          "/api": {
            target: "http://localhost:3000",
            changeOrigin: true,
            secure: true,
            rewrite: (path) => path,
          },
        },
      },
      plugins: [
        react(),
        mkcert(),
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
      base: env.VITE_IS_PROD ? "/seriichik-tg-miniapp/" : "/",
      // build: {
      //   rollupOptions: {
      //     output: {
      //       manualChunks(id) {
      //         if (id.includes("node_modules/@amplitude")) return "amplitude";
      //       },
      //     },
      //   },
      // },
      plugins: [
        react(),
        svgr({ include: "**/*.svg?svgr" }),
        visualizer({ open: false, gzipSize: true, filename: "dist/stats.html" }),
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }
});
