import { VNode, render } from "preact";
import { useEffect, useState } from "preact/hooks";
import PanelSelector from "../lib/components/admin/PanelSelector";

import "./blogpost-manager.scss";

function App() {
  const [component, setComponent] = useState({} as VNode);

  useEffect(() => setComponent(<PanelSelector setState={setComponent} />), []);

  return <>{component}</>;
}

const app = document.getElementById("app");

if (app) render(<App />, app);
