import { Component, RefObject, createRef } from "preact";
import { type CSSProperties } from "preact/compat";
import { default as Victor } from "victor";
import { Circle } from "../lib/circle";
import { Point2d } from "../lib/point2d";
import { Square } from "../lib/square";
import { State } from "../lib/state";
import { PositionCSS } from "../lib/style";

const { assign, values } = Object;

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

export enum CharAnimation {
  GATTER = "char-gatter-animation",
  SPREAD = "char-spread-animation",
  OUTOFBOUNDS = "char-outofbounds-animation",
  NONE = "char-no-animation",
}

export class Char extends Component<CharOptions, CharState> {
  private center: Point2d;
  private charBox: RefObject<HTMLDivElement> = createRef();
  public beingDragged: boolean;
  public repositioning: boolean;
  public current: Point2d;
  public activeZIndex: number = 3;
  public inactiveZIndex: number = 2;
  /** Number in pixels */
  public squareSideSize: number = 32; // placeholder
  public auraRadius: number = this.squareSideSize * 2; // placeholder

  constructor(props: CharOptions) {
    super(props);
    State.instance.add(this.props.index, this);
    this.center = this.getCenterPoint();
    this.current = this.center;
    this.state = {
      positionCSS: this.center.toStyle().toInlineCSS(this.inactiveZIndex),
      content: this.props.letter,
    };
    this.beingDragged = false;
    this.repositioning = false;
  }

  public usePrimaryIcon() {
    this.setState(assign(this.state, { content: this.props.letter }));
  }

  public useSecondaryIcon() {
    this.setState(assign(this.state, { content: this.props.icon }));
  }

  private spread() {
    State.instance.chars.forEach((char) => {
      char.setAnimation(CharAnimation.SPREAD);
      if (char.props.index === this.props.index) return;
      const p = char.randomValidPosition();
      char.setPosition(p, this.inactiveZIndex);
    });
  }

  public randomValidPosition(): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;
    let randomSquare: Square, anyOverlap: boolean;
    do {
      randomSquare = new Square(
        Point2d.random(w, h, this.squareSideSize),
        this.squareSideSize,
      );
      anyOverlap = State.instance.chars.some((char) =>
        randomSquare.overlap(new Square(char.current, this.squareSideSize)),
      );
    } while (anyOverlap);
    return randomSquare.center;
  }

  public gatter() {
    State.instance.chars.forEach((char) => {
      char.resetPosition();
      char.setAnimation(CharAnimation.GATTER);
    });
  }

  public resetPosition() {
    this.beingDragged = false;
    this.setPosition(this.center, this.inactiveZIndex);
  }

  private getCenterPoint(): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    return new Point2d((w / (this.props.length + 1)) * (this.props.index + 1), h / 2);
  }

  public setPosition(p: Point2d, zIndex: number) {
    const style = p.toStyle().toInlineCSS(zIndex);
    this.current = p;
    this.setState(assign(this.state, { positionCSS: style }));
  }

  public updateCenter() {
    this.center = this.getCenterPoint();
  }

  public updateSize() {
    if (!this.charBox.current) return;
    const box = this.charBox.current.getBoundingClientRect();
    this.squareSideSize = box.width;
    this.auraRadius = this.squareSideSize * 2;
  }

  private start() {
    if (State.instance.chars.some((char) => char.beingDragged)) return;
    const elemBox = this.charBox.current!.getBoundingClientRect();
    const current: Point2d = new Point2d(
      this.squareSideSize / 2 + elemBox.x,
      this.squareSideSize / 2 + elemBox.y,
    );
    this.setPosition(current, this.activeZIndex);
    this.spread();
  }

  private interrupt() {
    if (State.instance.chars.some((char) => char.beingDragged)) return;
    this.gatter();
  }

  private startDragging() {
    this.beingDragged = true;
    State.instance.setActive(this.props.index);
    if (State.instance.canvas) State.instance.canvas.rise();
    this.setAnimation(CharAnimation.NONE);
  }

  private stopAndReset() {
    this.beingDragged = false;
    State.instance.inactive();
    if (State.instance.canvas) State.instance.canvas.reset();
  }

  private onTransitionEnd() {
    if (!this.charBox.current) return;
    if (
      this.charBox.current.classList.contains(CharAnimation.OUTOFBOUNDS) ||
      this.charBox.current.classList.contains(CharAnimation.SPREAD)
    ) {
      this.setAnimation(CharAnimation.NONE);
    }

    this.releaseAnimationLock();
  }

  private releaseAnimationLock() {
    this.repositioning = false;
  }

  private acquireAnimationLock() {
    this.repositioning = true;
  }

  public setAnimation(type: CharAnimation) {
    if (!this.charBox.current) return;
    this.charBox.current.classList.remove(...values(CharAnimation));
    this.charBox.current.classList.add(type);
  }

  public repel(from: Point2d) {
    if (this.beingDragged || this.repositioning) return;
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
        tmpFinal = final.clone().add(relative),
        burstedX =
          tmpFinal.x <= this.squareSideSize || tmpFinal.x >= w - this.squareSideSize,
        burstedY =
          tmpFinal.y <= this.squareSideSize || tmpFinal.y >= h - this.squareSideSize;

      if (burstedX || burstedY) {
        const p = this.randomValidPosition();
        this.setAnimation(CharAnimation.OUTOFBOUNDS);
        this.setPosition(p, this.inactiveZIndex);
        return;
      }
    }

    final.add(relative);
    this.setPosition(Point2d.fromObject(final), this.inactiveZIndex);
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

    this.setPosition(new Point2d(x, y), this.activeZIndex);
    State.instance.chars.forEach((char) => char.repel(this.current));
  }

  render() {
    return (
      <div
        className="char"
        onMouseEnter={() => this.start()}
        onMouseLeave={() => this.interrupt()}
        onMouseDown={() => this.startDragging()}
        onMouseUp={() => this.stopAndReset()}
        onTransitionRun={() => this.acquireAnimationLock()}
        onTransitionEnd={() => this.onTransitionEnd()}
        onTransitionCancel={() => this.releaseAnimationLock()}
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

  componentDidMount() {
    this.updateSize();
  }
}
