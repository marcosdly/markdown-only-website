// import markdown from "../../test/example.md";
import { Article } from "./article";
import { UpperNav } from "./upperNav";

export function App({ md }: { md: string }) {
  return (
    <>
      <UpperNav />
      <Article md={md} />
    </>
  );
}

// if (window) {
//   const idApp = document.getElementById("app");
//   if (idApp) render(<App md={markdown} />, idApp);
// }
