import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "global-builtin",
          "if-function",
          "color-functions",
        ],
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Charts
            if (id.includes("apexcharts") || id.includes("react-apexcharts")) {
              return "charts";
            }
            // ExcelJS — the main culprit inside vendor-misc (very large)
            if (id.includes("exceljs")) {
              return "exceljs";
            }
            // Data table / export libs
            if (
              id.includes("react-table") ||
              id.includes("xlsx") ||
              id.includes("file-saver")
            ) {
              return "datatable";
            }
            // State management
            if (
              id.includes("@reduxjs") ||
              id.includes("react-redux") ||
              id.includes("react-query")
            ) {
              return "store";
            }
            // Form + validation
            if (id.includes("formik") || id.includes("yup")) {
              return "forms";
            }
            // UI utilities
            if (
              id.includes("react-select") ||
              id.includes("react-topbar") ||
              id.includes("bootstrap")
            ) {
              return "ui";
            }
            // React core
            if (id.includes("react-dom")) return "react-dom";
            if (
              id.includes("react-router-dom") ||
              id.includes("react-router/")
            )
              return "router";
            if (id.includes("/react/")) return "react";

            // Axios + network libs
            if (id.includes("axios") || id.includes("@popperjs")) {
              return "network";
            }
            // i18n / intl / formatting
            if (
              id.includes("@formatjs") ||
              id.includes("intl-") ||
              id.includes("icu-messageformat")
            ) {
              return "i18n";
            }
            // Everything else
            return "vendor-misc";
          }

          // Metronic source splits
          if (id.includes("/_metronic/")) {
            // i18n translations are large JSON files
            if (id.includes("/i18n/")) return "metronic-i18n";
            // Layout components
            if (id.includes("/layout/") || id.includes("/partials/"))
              return "metronic-layout";
            // Everything else in metronic
            return "metronic";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "apexcharts",
      "react-apexcharts",
      "bootstrap",
    ],
  },
});