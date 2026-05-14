import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import flightLogApiPlugin from "./src/plugins/flightLogApiPlugin";

export default defineConfig({
  plugins: [flightLogApiPlugin(), react(), tailwindcss()],
  test: {
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "dist"],
    globals: true,
    setupFiles: "./vitest.setup.ts"
  }
});
