import { Char } from "./components/Char";
import { DragCanvas } from "./components/DragCanvas";

export function App() {
  const components = "GoldmanYayCool".split("").map((c, i, arr) => <Char href="" letter={c} index={i} length={arr.length} />);
  return <>
    <DragCanvas />
    <div id="char-container">
      {components}
    </div>
  </>
}
