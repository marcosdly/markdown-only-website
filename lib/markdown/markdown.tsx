import MarkdownIt from "markdown-it";
// @ts-ignore
import deflist from "markdown-it-deflist";
// @ts-ignore
import { full as emoji } from "markdown-it-emoji";
// @ts-ignore
import footnote from "markdown-it-footnote";
// @ts-ignore
import sub from "markdown-it-sub";
// @ts-ignore
import sup from "markdown-it-sup";

export function markdown(): MarkdownIt {
  const markdownit = MarkdownIt();
  markdownit.use(footnote).use(emoji).use(deflist).use(sub).use(sup);
  return markdownit;
}
