import { VNode, createContext } from "preact";
import { StateUpdater } from "preact/hooks";

const MainContext = createContext<StateUpdater<VNode>>({} as StateUpdater<VNode>);
export default MainContext;
