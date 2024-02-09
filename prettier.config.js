"use strict";

/** @type {import("prettier").Config | import("prettier-plugin-jsdoc").Options} */
export default {
  plugins: [
    "@prettier/plugin-xml",
    "prettier-plugin-jsdoc",
    "prettier-plugin-organize-imports",
  ],
  printWidth: 88,
  htmlWhitespaceSensitivity: "strict",
  jsdocDescriptionWithDot: true,
  jsdocPreferCodeFences: true,
};
