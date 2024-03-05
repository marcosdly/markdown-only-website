"use strict";

import { cdnAlias, dependencies } from "../../package.json";
const { fromEntries, entries, assign, keys } = Object;

interface CdnAlias {
  replace: Record<string, string>;
  regex: Record<string, { expr: string; path: string }>;
  npm: Record<string, string>;
}

const deps = dependencies as Record<string, string>;
const cdn = cdnAlias as CdnAlias;

class URL {
  static npm(name: string, version: string, path: string) {
    return `https://cdn.jsdelivr.net/npm/${name}@${version}/${path}`;
  }
}

const tryReplace = (name: string) => (name in cdn.replace ? cdn.replace[name] : name);

const npm = fromEntries(
  keys(deps)
    .filter((pkg) => pkg in cdn.npm || pkg in cdn.replace)
    .map((pkg) => {
      const replaced = tryReplace(pkg);
      return [pkg, URL.npm(replaced, deps[pkg], cdn.npm[replaced])];
    }),
);

const npmRegex = fromEntries(
  entries(cdn.regex).map(([pkg, info]) => {
    return [info.expr, URL.npm(pkg, deps[pkg], info.path)];
  }),
);

export const aliases = assign({}, npm, npmRegex);
