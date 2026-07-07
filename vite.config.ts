import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-vite-plugin";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Please make sure that '@tanstack/router-vite-plugin' is passed before '@vitejs/plugin-react'
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ["@solar-icons/react"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://orflow-backend.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/v1"),
      },
      "/v1": {
        target: "https://orflow-backend.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
