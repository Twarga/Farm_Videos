import nextConfig from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextConfig,
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}", "src/lib/public-*.ts", "src/lib/catalog.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": ["error", { paths: [
        { name: "@/lib/offers", message: "Use the published repository; demo offers are opt-in through public-data-mode." },
        { name: "./offers", message: "Use the published repository; demo offers are opt-in through public-data-mode." },
      ], patterns: [{ group: ["**/lib/offers", "../offers"], message: "Static fixture: use the published repository." }] }],
    },
  },
  {
    rules: {
      // Existing client hydration intentionally restores persisted UI state in effects.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "playwright-report/**",
      "test-results/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "third design/**",
      "third design",
      "**/third design/**",
      "research-app/**",
      "tmp/**",
    ],
  },
];

export default eslintConfig;
