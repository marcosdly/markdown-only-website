import { Component } from "preact";
import { State } from "../lib/state";

interface Style {
  zIndex: string;
}

export class DragCanvas extends Component<unknown, Style> {
  private activeStyle: Style = { zIndex: "2000" };
  private inactiveStyle: Style = { zIndex: "-1000" };

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
    if (State.instance.active) State.instance.getActive()!.gatter();
    State.instance.inactive();
  }

  public reset() {
    this.sink();
  }

  private dispatch(ev: MouseEvent) {
    if (State.instance.active) State.instance.getActive()!.drag(ev);
  }

  render() {
    return (
      <div
        id="drag-canvas"
        onMouseEnter={() => this.rise()}
        onMouseDown={() => this.rise()}
        onMouseLeave={() => this.sink()}
        onMouseUp={() => this.sink()}
        onMouseMove={(ev) => this.dispatch(ev)}
        style={this.state}
      ></div>
    );
  }
}
