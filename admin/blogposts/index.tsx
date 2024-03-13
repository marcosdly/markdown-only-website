import { render } from "preact";
import DocumentInfo from "../../lib/components/admin/blogposts/DocumentInfo";
import DocumentSelector from "../../lib/components/admin/blogposts/DocumentSelector";
import MarkdownPreview from "../../lib/components/admin/blogposts/MarkdownPreview";

function App() {
  return (
    <>
      <DocumentSelector />
      <DocumentInfo />
      <MarkdownPreview />
    </>
  );
}

const app = document.getElementById("app");

if (app) render(<App />, app);
