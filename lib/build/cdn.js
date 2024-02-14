"use strict";

import { cdnAlias, dependencies } from "../../package.json";
const { fromEntries, entries, assign, keys } = Object;

class URL {
  static npm(name, version, path) {
    return `https://cdn.jsdelivr.net/npm/${name}@${version}/${path}`;
  }
}

/** @type {Record<string, string>} */
const npm = fromEntries(
  keys(dependencies)
    .filter((pkg) => pkg in cdnAlias.npm)
    .map((pkg) => [pkg, URL.npm(pkg, dependencies[pkg], cdnAlias.npm[pkg])]),
);

export const aliases = assign({}, npm);
