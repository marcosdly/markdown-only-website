import { useEffect } from "preact/hooks";
import { Char } from "./components/Char";
import { DragCanvas } from "./components/DragCanvas";
import { characters } from "./lib/content";
import { State } from "./lib/state";

export function App() {
  useEffect(() => {
    addEventListener("resize", () => {
      State.instance.chars.forEach((char) => {
        char.updateCenter();
        char.updateSize();
      });
    });
  }, []);

  const components = characters.map((info, i, arr) => (
    <Char
      href={info.url}
      letter={info.letter}
      iconPath={info.iconPath}
      index={i}
      length={arr.length}
    />
  ));

  return (
    <>
      <DragCanvas />
      <div id="char-container">{components}</div>
    </>
  );
}
