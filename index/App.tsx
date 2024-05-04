import { Char } from "./components/Char";

export function App() {
  const components = "MarcosBião".split("").map((c, i, arr) => <Char href="" letter={c} index={i} length={arr.length} />);
  return (
    <div id="char-container">
      {components}
    </div>
  )
}
