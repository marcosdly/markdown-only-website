import { Component, RefObject, createRef } from "preact";
import { default as Victor } from "victor";
import { Circle } from "../lib/circle";
import { Point2d } from "../lib/point2d";
import { Square } from "../lib/square";
import { State } from "../lib/state";
import { PositionCSS } from "../lib/style";

interface CharOptions {
  letter: string;
  href: string;
  index: number;
  length: number;
}

export class Char extends Component<CharOptions, PositionCSS> {
  private center: Point2d;
  private charBox: RefObject<HTMLDivElement> = createRef();
  public beingDragged: boolean;
  public current: Point2d;
  public activeZIndex: number = 1000;
  public inactiveZIndex: number = 1;
  /** Number in pixels */
  public squareSideSize: number = 32;
  public auraRadius: number = this.squareSideSize * 3;

  constructor(props: CharOptions) {
    super(props);
    State.instance.add(this.props.index, this);
    this.center = this.getCenterPoint();
    this.current = this.center;
    this.state = this.center.toStyle().toInlineCSS(this.inactiveZIndex, true);
    this.beingDragged = false;
  }

  private spread() {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    State.instance.chars.forEach((char, _, arr) => {
      if (char.props.index === this.props.index) return;
      let randomSquare: Square, anyOverlap: boolean;
      do {
        randomSquare = new Square(
          Point2d.random(w, h, this.squareSideSize),
          this.squareSideSize,
        );
        anyOverlap = arr.some((char) =>
          randomSquare.overlap(new Square(char.current, this.squareSideSize)),
        );
      } while (anyOverlap);
      char.current = randomSquare.center;
      char.setState(
        randomSquare.center.toStyle().toInlineCSS(this.inactiveZIndex, true),
      );
    });
  }

  public gatter() {
    State.instance.chars.forEach((char) => char.resetPosition());
  }

  public resetPosition() {
    this.beingDragged = false;
    this.current = this.center;
    this.setState(this.center.toStyle().toInlineCSS(this.inactiveZIndex, true));
  }

  private getCenterPoint(): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    return new Point2d((w / (this.props.length + 1)) * (this.props.index + 1), h / 2);
  }

  private onMouseEnter() {
    if (State.instance.chars.some((char) => char.beingDragged)) return;
    const elemBox = this.charBox.current!.getBoundingClientRect();
    const current: Point2d = new Point2d(
      this.squareSideSize / 2 + elemBox.x,
      this.squareSideSize / 2 + elemBox.y,
    );
    const style = current.toStyle().toInlineCSS(this.activeZIndex, true);
    this.current = current;
    this.setState(style);
    this.spread();
  }

  private onMouseLeave() {
    if (State.instance.chars.some((char) => char.beingDragged)) return;
    this.gatter();
  }

  private onMouseDown() {
    this.beingDragged = true;
    State.instance.setActive(this.props.index);
    if (State.instance.canvas) State.instance.canvas.rise();
  }

  private onMouseUp() {
    this.beingDragged = false;
    State.instance.inactive();
    if (State.instance.canvas) State.instance.canvas.reset();
  }

  public repel(from: Point2d) {
    if (this.beingDragged) return;
    const avoid = new Circle(from, this.auraRadius);
    if (!avoid.containsPoint(this.current)) return;

    const relative = Victor.fromObject(from);
    const final = Victor.fromObject(this.current)
      .subtract(relative)
      .normalize()
      .multiplyScalar(this.auraRadius);

    // prevent out of bounds ...
    {
      const w = document.documentElement.offsetWidth,
        h = document.documentElement.offsetHeight,
        tmpFinal = final.clone().add(relative);

      if (tmpFinal.x <= this.squareSideSize || tmpFinal.x >= w - this.squareSideSize)
        final.invertX();

      if (tmpFinal.y <= this.squareSideSize || tmpFinal.y >= h - this.squareSideSize)
        final.invertY();
    }

    final.add(relative);
    this.current = Point2d.fromObject(final);
    this.setState(this.current.toStyle().toInlineCSS(this.inactiveZIndex, false));
  }

  public drag(ev: MouseEvent | Point2d) {
    if (!this.beingDragged) return;

    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    let x: number, y: number;

    if (ev.x >= w - this.squareSideSize) x = w - this.squareSideSize;
    else if (ev.x <= this.squareSideSize) x = this.squareSideSize;
    else x = ev.x;

    if (ev.y >= h - this.squareSideSize) y = h - this.squareSideSize;
    else if (ev.y <= this.squareSideSize) y = this.squareSideSize;
    else y = ev.y;

    this.current = new Point2d(x, y);
    this.setState(this.current.toStyle().toInlineCSS(this.activeZIndex, false));
    State.instance.chars.forEach((char) => char.repel(this.current));
  }

  render() {
    return (
      <div
        className="char"
        onMouseEnter={() => this.onMouseEnter()}
        onMouseLeave={() => this.onMouseLeave()}
        onMouseDown={() => this.onMouseDown()}
        onMouseUp={() => this.onMouseUp()}
        onMouseMove={(ev) => this.drag(ev)}
        ref={this.charBox}
        style={this.state}
      >
        <a className="char-link" href={this.props.href}>
          {this.props.letter}
        </a>
      </div>
    );
  }
}
