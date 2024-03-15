import { VNode, render } from "preact";

import { useState } from "preact/hooks";
import MainContext from "../lib/admin/MainContext";
import PanelSelector from "../lib/components/admin/PanelSelector";
import "./blogpost-manager.scss";

function App() {
  const [state, setState] = useState<VNode>(<PanelSelector />);
  return (
    <>
      <MainContext.Provider value={setState}>{state}</MainContext.Provider>
    </>
  );
}

const app = document.getElementById("app");

if (app) render(<App />, app);
