import { initializeApp } from "firebase-admin/app";
import * as https from "firebase-functions/v2/https";
import * as jsdom from "jsdom";
import * as fs from "node:fs/promises";
import { render } from "preact-render-to-string";
import { App } from "../../lib/common/app";

class AppIDNotFound extends Error {}

initializeApp();

async function writeMarkdown(md: string): Promise<string> {
  const template = await fs.readFile("../dist/index.html", { encoding: "utf-8" });
  const dom = new jsdom.JSDOM(template);
  const app = dom.window.document.getElementById("app");
  if (app) {
    app.innerHTML = render(<App md={md} />);
  } else {
    throw new AppIDNotFound();
  }
  return dom.serialize();
}

export const about = https.onRequest({ concurrency: 1 }, async (request, response) => {
  if (request.method !== "GET") return;
  const md = await fs.readFile("../about/about.md", { encoding: "utf-8" });
  let html;
  try {
    html = writeMarkdown(md);
  } catch (err) {
    if (err instanceof AppIDNotFound) {
      response.status(500).send("Template parsing error").end();
      return;
    }
  }
  response
    .status(200)
    .send(await html)
    .setHeader("Content-Type", "text/html")
    .end();
  return;
});
