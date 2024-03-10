import { markdown } from "../markdown/markdown";

interface ArticleProps {
  md: string;
}

export function Article({ md }: ArticleProps) {
  const markdownParser = markdown();

  return (
    <div id="article-container">
      <div
        id="article"
        className="lexend-font"
        dangerouslySetInnerHTML={{ __html: markdownParser.render(md) }}
      ></div>
    </div>
  );
}
