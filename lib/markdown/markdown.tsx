import dompurify from "dompurify";
import hljs from "highlight.js";
import { Marked } from "marked";
import { baseUrl } from "marked-base-url";
import { createDirectives } from "marked-directive";
import markedFootnote from "marked-footnote";
import { markedHighlight } from "marked-highlight";
import { markedSmartypants } from "marked-smartypants";
import { imageDirectives } from "./directives/image";

export class Markdown {
  marked: Marked;

  constructor() {
    this.marked = new Marked(
      baseUrl(window.origin),
      markedFootnote(),
      markedSmartypants(),
      markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang, info) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, { language }).value;
        },
      }),
      createDirectives([...imageDirectives]),
    );
  }

  async parse(md: string): Promise<string> {
    return dompurify.sanitize(await this.marked.parse(md), {
      USE_PROFILES: { html: true },
    });
  }
}
