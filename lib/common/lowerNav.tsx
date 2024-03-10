interface SectionProps {
  name: string;
  anchors: string[][];
}

type SectionPropsRecord = Record<string, string[][]>;

const links: SectionPropsRecord = {
  "The Man": [
    ["about", "/about"],
    ["blog", "/blog"],
    ["resume", "/resume"],
    ["social", "/social"],
  ],
};

function Section({ name, anchors }: SectionProps) {
  const components = anchors.map(([title, url]) => {
    return (
      <li className="link">
        <a href={url}>{title}</a>
      </li>
    );
  });

  return (
    <div className="footer-section">
      <h3 className="title">{name}</h3>
      <ol className="link-container">{components}</ol>
    </div>
  );
}

export function LowerNav() {
  const components = Object.entries(links).map(([title, anchors]) => {
    return <Section name={title} anchors={anchors} />;
  });

  return (
    <div id="lower-nav-container">
      <nav id="lower-nav" className="lexend-font">
        {components}
      </nav>
    </div>
  );
}
