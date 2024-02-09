"use strict";

import * as vite from "vite";

export default vite.defineConfig((command, mode) => {
  /** @type {vite.UserConfig} */
  let defaults = {
    logLevel: "silent" ? mode === "prod" : "info",
    appType: "mpa",
    plugins: [],
    css: {
      devSourcemap: true ? mode === "dev" : false,
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
        input: ["./pages/home/index.html"],
        preserveEntrySignatures: "allow-extension",
        output: {
          preserveModules: false,
        },
      },
      manifest: "manifest.json",
    },
  };

  let modified = Object.assign({}, defaults);

  return modified;
});
