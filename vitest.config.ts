import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", ".next/**", "out/**"],
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**/*.{ts,tsx}", "app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.*",
        "**/*.d.ts",
        // shadcn boilerplate / generated UI primitives and route scaffolding
        "components/ui/**",
        "app/**/page.tsx",
        "app/**/loading.tsx",
        "app/layout.tsx",
        "app/providers.tsx",
        "**/*skeleton*",
      ],
    },
  },
});