export default function MarkdownPreview() {
  return (
    <div className="local-markdown-preview">
      <textarea
        placeholder="Markdown here..."
        id="markdown-preview"
        className="bg-dark text-white rounded"
      ></textarea>
    </div>
  );
}
