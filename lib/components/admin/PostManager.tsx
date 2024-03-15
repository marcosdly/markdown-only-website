import DocumentInfo from "./DocumentInfo";
import DocumentSelector from "./DocumentSelector";
import MarkdownPreview from "./MarkdownPreview";
import { ReturnButton } from "./MiscButtons";
import PanelSelector from "./PanelSelector";

export default function PostManager() {
  return (
    <>
      <ReturnButton previousComponent={<PanelSelector />} />
      <DocumentSelector />
      <DocumentInfo />
      <MarkdownPreview />
    </>
  );
}
