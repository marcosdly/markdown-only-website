"use strict";

import * as vite from "vite";
import * as cdn from "./lib/build/cdn";
import * as sass from "./lib/build/sass";

export default vite.defineConfig(({ mode }) => {
  /** @type {vite.UserConfig} */
  let defaults = {
    logLevel: "silent" ? mode === "prod" : "info",
    appType: "mpa",
    plugins: [],
    css: {
      devSourcemap: true ? mode === "dev" : false,
      preprocessorOptions: {
        scss: sass.options,
      },
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
      minify: "terser" ? mode === "prod" : "esbuild",
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

  /** @type {vite.UserConfig} */
  let productionDefaults = {
    resolve: {
      alias: cdn.aliases,
    },
  };

  if (mode === "prod") return Object.assign(defaults, productionDefaults);

  return defaults;
});
