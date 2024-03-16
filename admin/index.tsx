import { VNode, render } from "preact";

import { useState } from "preact/hooks";
import MainContext from "../lib/admin/MainContext";
import Login from "../lib/components/admin/Login";
import "./blogpost-manager.scss";

function App() {
  const [state, setState] = useState<VNode>(<Login />);
  return (
    <>
      <MainContext.Provider value={setState}>{state}</MainContext.Provider>
    </>
  );
}

const app = document.getElementById("app");

if (app) render(<App />, app);
