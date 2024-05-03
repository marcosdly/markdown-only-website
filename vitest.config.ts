import { defineConfig, mergeConfig, type UserConfig } from "vitest/config";
import viteConfig from "./vite.config";

const vitestConfig = defineConfig(({ mode }) => {
  const defaultConfig: UserConfig = {
    server: {
      open: false,
    },
    test: {
      // setupFiles: "./test/setup.ts",
      server: { sourcemap: true },
      browser: {
        enabled: true,
        name: "chrome",
        headless: false,
        isolate: true,
      },
    },
  };

  return Object.assign({}, defaultConfig);
});

export default defineConfig((config) =>
  mergeConfig(viteConfig(config), vitestConfig(config)),
);
