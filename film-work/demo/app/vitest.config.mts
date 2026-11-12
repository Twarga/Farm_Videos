import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  // Unit tests import components that use CSS modules. Tailwind's PostCSS
  // plugin is a Next build concern; tests only need class-name maps.
  css: { postcss: { plugins: [] } },
  test: { environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
