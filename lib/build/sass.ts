"use strict";

import { hexToCSSFilter } from "hex-to-css-filter";
import * as sass from "sass";

const customFunctions: Record<string, sass.CustomFunction<"sync">> = {
  "hex-to-filter($color)": function (color: any) {
    /** @type {sass.SassColor} */
    const value: sass.SassColor = color.dartValue;
    try {
      value.assertColor();
    } catch {
      throw new TypeError("Should be a color");
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

export const options: sass.Options<"sync"> = {
  charset: true,
  functions: customFunctions,
};
