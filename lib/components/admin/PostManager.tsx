import DocumentInfo from "./DocumentInfo";
import DocumentSelector from "./DocumentSelector";
import MarkdownPreview from "./MarkdownPreview";

export default function PostManager() {
  return (
    <>
      <DocumentSelector />
      <DocumentInfo />
      <MarkdownPreview />
    </>
  );
}
