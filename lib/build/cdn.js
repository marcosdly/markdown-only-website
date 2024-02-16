"use strict";

import { cdnAlias, dependencies } from "../../package.json";
const { fromEntries, entries, assign, keys } = Object;

class URL {
  static npm(name, version, path) {
    return `https://cdn.jsdelivr.net/npm/${name}@${version}/${path}`;
  }
}

const tryReplace = (name) => (name in cdnAlias.replace ? cdnAlias.replace[name] : name);

/** @type {Record<string, string>} */
const npm = fromEntries(
  keys(dependencies)
    .filter((pkg) => pkg in cdnAlias.npm || pkg in cdnAlias.replace)
    .map((pkg) => {
      const replaced = tryReplace(pkg);
      return [pkg, URL.npm(replaced, dependencies[pkg], cdnAlias.npm[replaced])];
    }),
);

export const aliases = assign({}, npm);
