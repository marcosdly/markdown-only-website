"use strict";

import { hexToCSSFilter } from "hex-to-css-filter";
import * as sass from "sass";

class SassTypeError extends sass.Exception {
  name = "TypeError";

  /** @param {string} expectedType */
  constructor(expectedType) {
    super();
    this.message = `Given value's type is not '${expectedType}'`;
  }
}

/** @type {Record<string, sass.CustomFunction<"sync">>} */
const customFunctions = {
  "hex-to-filter($color)": function (color) {
    /** @type {sass.SassColor} */
    const value = color.dartValue;
    try {
      value.assertColor();
    } catch {
      throw new SassTypeError("Color");
    }

    // No alpha, and that's apparently common across implementations.
    const hex =
      "#" +
      [value.red, value.green, value.blue]
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("");
    const converted = hexToCSSFilter(hex, {
      acceptanceLossPercentage: 2,
      maxChecks: 100,
    });
    return new sass.SassString(converted.filter, { quotes: false });
  },
};

/** @type {sass.Options<"sync">} */
export const options = {
  charset: true,
  functions: customFunctions,
};
