"use strict";

import preact from "@preact/preset-vite";
import * as vite from "vite";
import rawLoader from "vite-raw-plugin";

export default vite.defineConfig(({ mode }) => {
  const isProd = mode === "prod",
    isDev = mode === "dev";

  const developmentDefaults: vite.UserConfig = {
    logLevel: isProd ? "silent" : "info",
    // appType: "mpa",
    plugins: [preact(), rawLoader({ fileRegex: /\.(md|txt)$/ })],
    css: {
      devSourcemap: isDev,
    },
    json: {
      stringify: true,
    },
    server: {
      open: true,
    },
    esbuild: {
      legalComments: "none",
    },
    build: {
      target: "modules",
      assetsInlineLimit: 0,
      cssMinify: true,
      minify: isProd ? "terser" : "esbuild",
      assetsDir: "",
      terserOptions: {
        format: { comments: false },
      },
      rollupOptions: {
        input: ["./index.html"],
        preserveEntrySignatures: "allow-extension",
        output: {
          preserveModules: false,
        },
      },
      manifest: "manifest.json",
    },
  };

  const productionDefaults: vite.UserConfig = {};

  if (isProd) return Object.assign(developmentDefaults, productionDefaults);

  return developmentDefaults;
});
