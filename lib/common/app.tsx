import { render } from "preact";
import markdown from "../../test/example.md";
import { Article } from "./article";
import { LowerNav } from "./lowerNav";
import { UpperNav } from "./upperNav";

export function App({ md }: { md: string }) {
  return (
    <>
      <div id="content-container">
        <UpperNav />
        <Article md={md} />
        <LowerNav />
      </div>
    </>
  );
}

if (window) {
  const idApp = document.getElementById("app");
  if (idApp) render(<App md={markdown} />, idApp);
}
