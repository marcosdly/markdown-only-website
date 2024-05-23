import { useEffect } from "preact/hooks";
import { Char } from "./components/Char";
import { DragCanvas } from "./components/DragCanvas";
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

  const components = "GoldmanYayCool"
    .split("")
    .map((c, i, arr) => (
      <Char
        href=""
        letter={c}
        icon={arr[arr.length - (i + 1)]}
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
