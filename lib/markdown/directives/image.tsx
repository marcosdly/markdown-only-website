import { Directive, type DirectiveConfig } from "marked-directive";
import { render as toString } from "preact-render-to-string";

const float: DirectiveConfig = {
  level: "block",
  marker: "!!",
  renderer(token: Directive) {
    const src: string = token.attrs?.src ? (token.attrs.src as string) : "";
    let floatMode: string = "float-none";

    if (token.meta?.name && ["left", "right", "none"].includes(token.meta.name)) {
      floatMode = "float-" + token.meta.name;
    }

    const Result = () => (
      <div className={`${floatMode} floating-image`}>
        <img src={src} alt={token.text} />
      </div>
    );

    return toString(<Result />);
  },
};

export const imageDirectives: DirectiveConfig[] = [float];
