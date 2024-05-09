import { Component } from "preact";
import { DragState } from "../dragState";

interface Style {
  zIndex: string;
}

export class DragCanvas extends Component<unknown, Style> {
  private activeStyle: Style = { zIndex: "2000" };
  private inactiveStyle: Style = { zIndex: "-1000" };

  constructor() {
    super();
    this.state = this.inactiveStyle;
    DragState.instance.setDragCanvasInstance(this);
  }

  public rise() {
    this.setState(this.activeStyle);
  }

  public sink() {
    this.setState(this.inactiveStyle);
    if (DragState.instance.isCharInitialized)
      DragState.instance.char!.gatter();
    DragState.instance.resetCharInstance();
  }

  public reset() { this.sink(); };

  private dispatch(ev: MouseEvent) {
    if (DragState.instance.isCharInitialized)
      DragState.instance.char!.drag(ev);
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
      >
      </div>
    );
  }
}
