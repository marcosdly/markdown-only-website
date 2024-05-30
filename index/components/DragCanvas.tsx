import { Component } from "preact";
import { State } from "../lib/state";
import { CharOperations } from "./Char";

interface Style {
  zIndex: string;
}

export class DragCanvas extends Component<unknown, Style> {
  private activeStyle: Style = { zIndex: "10" };
  private inactiveStyle: Style = { zIndex: "1" };

  constructor() {
    super();
    this.state = this.inactiveStyle;
    State.instance.setCanvas(this);
  }

  public rise() {
    this.setState(this.activeStyle);
  }

  public sink() {
    this.setState(this.inactiveStyle);
    if (State.instance.isActive()) {
      CharOperations.gatter();
      State.instance.getActive()!.usePrimaryIcon();
      State.instance.inactive();
    }
  }

  public reset() {
    this.sink();
  }

  private onMove(ev: MouseEvent) {
    // dispatch position
    if (State.instance.isActive()) {
      State.instance.getActive()!.drag(ev);
      return;
    }

    // change icon
    const h = document.documentElement.offsetHeight;
    if (ev.y > h / 2) {
      State.instance.chars.forEach((char) => char.useSecondaryIcon());
    } else {
      State.instance.chars.forEach((char) => char.usePrimaryIcon());
    }
  }

  render() {
    return (
      <div
        id="drag-canvas"
        // onMouseEnter={() => this.rise()}
        // onMouseDown={() => this.rise()}
        onMouseLeave={() => this.sink()}
        onMouseUp={() => this.sink()}
        onMouseMove={(ev) => this.onMove(ev)}
        style={this.state}
      ></div>
    );
  }
}
