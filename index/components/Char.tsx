import { Component, RefObject, createRef } from "preact";
import { type CSSProperties } from "preact/compat";
import { default as Victor } from "victor";
import { Circle } from "../lib/circle";
import { Point2d } from "../lib/point2d";
import { Square } from "../lib/square";
import { State } from "../lib/state";
import { PositionCSS } from "../lib/style";

const { assign } = Object;

interface CharOptions {
  letter: string;
  icon: string;
  href: string;
  index: number;
  length: number;
}

interface CharState {
  positionCSS: PositionCSS;
  content: string;
}

export class Char extends Component<CharOptions, CharState> {
  private center: Point2d;
  private charBox: RefObject<HTMLDivElement> = createRef();
  public beingDragged: boolean;
  public current: Point2d;
  public activeZIndex: number = 3;
  public inactiveZIndex: number = 2;
  /** Number in pixels */
  public squareSideSize: number = 32;
  public auraRadius: number = this.squareSideSize * 3;

  constructor(props: CharOptions) {
    super(props);
    State.instance.add(this.props.index, this);
    this.center = this.getCenterPoint();
    this.current = this.center;
    this.state = {
      positionCSS: this.center.toStyle().toInlineCSS(this.inactiveZIndex, true),
      content: this.props.letter,
    };
    this.beingDragged = false;
  }

  public usePrimaryIcon() {
    this.setState(assign(this.state, { content: this.props.letter }));
  }

  public useSecondaryIcon() {
    this.setState(assign(this.state, { content: this.props.icon }));
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
      char.setPosition(randomSquare.center, this.inactiveZIndex, true);
    });
  }

  public gatter() {
    State.instance.chars.forEach((char) => char.resetPosition());
  }

  public resetPosition() {
    this.beingDragged = false;
    this.setPosition(this.center, this.inactiveZIndex, true);
  }

  private getCenterPoint(): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    return new Point2d((w / (this.props.length + 1)) * (this.props.index + 1), h / 2);
  }

  public setPosition(p: Point2d, zIndex: number, animations: boolean) {
    const style = p.toStyle().toInlineCSS(zIndex, animations);
    this.current = p;
    this.setState(assign(this.state, { positionCSS: style }));
  }

  public updateCenter() {
    this.center = this.getCenterPoint();
  }

  private onMouseEnter() {
    if (State.instance.chars.some((char) => char.beingDragged)) return;
    const elemBox = this.charBox.current!.getBoundingClientRect();
    const current: Point2d = new Point2d(
      this.squareSideSize / 2 + elemBox.x,
      this.squareSideSize / 2 + elemBox.y,
    );
    this.setPosition(current, this.activeZIndex, true);
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
    this.setPosition(Point2d.fromObject(final), this.inactiveZIndex, false);
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

    this.setPosition(new Point2d(x, y), this.activeZIndex, false);
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
        // onMouseMove={(ev) => this.drag(ev)}
        ref={this.charBox}
        style={this.state.positionCSS as CSSProperties}
      >
        <a className="char-link" href={this.props.href}>
          {this.state.content}
        </a>
      </div>
    );
  }
}
