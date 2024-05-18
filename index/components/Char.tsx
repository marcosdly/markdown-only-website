import { Component, RefObject, createRef } from "preact";
import { DragState } from "../dragState";
import { Direction, relativeDirection } from "../lib/direction";
import { Point2d } from "../lib/point2d";
import { Square } from "../lib/square";
import { PositionCSS } from "../lib/style";

interface CharOptions {
  letter: string;
  href: string;
  index: number;
  length: number;
}

/**
 * - Size dynamically increased according to max index.
 * - Index can be arbitrarilly set.
 * - **Must not be exported**.
 */
const globalState__charRefs: Char[] = [];

export class Char extends Component<CharOptions, PositionCSS> {
  private references = globalState__charRefs;
  private center: Point2d;
  private charBox: RefObject<HTMLDivElement> = createRef();
  public beingDragged: boolean;
  public current: Point2d;
  public activeZIndex: number = 1000;
  public inactiveZIndex: number = 1;
  /** Number in pixels */
  public squareSideSize: number = 32;
  public auraSquareSideSize: number = this.squareSideSize * 3;

  constructor(props: CharOptions) {
    super(props);
    this.references[this.props.index] = this;
    this.center = this.getCenterPoint();
    this.current = this.center;
    this.state = this.center.toStyle().toInlineCSS(this.inactiveZIndex, true);
    this.beingDragged = false;
  }

  private spread() {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    this.references.forEach((char) => {
      if (char.props.index === this.props.index) return;
      let randomSquare: Square, anyOverlap: boolean;
      do {
        randomSquare = new Square(
          Point2d.random(w, h, this.squareSideSize),
          this.squareSideSize,
        );
        anyOverlap = this.references.some((char) =>
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
    this.references.forEach((char) => char.resetPosition());
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
    if (this.references.some((char) => char.beingDragged)) return;
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
    if (this.references.some((char) => char.beingDragged)) return;
    this.gatter();
  }

  private onMouseDown() {
    this.beingDragged = true;
    DragState.instance.setCharInstance(this);
    if (DragState.instance.isDragCanvasInitialized)
      DragState.instance.dragCanvas!.rise();
  }

  private onMouseUp() {
    this.beingDragged = false;
    if (DragState.instance.isDragCanvasInitialized)
      DragState.instance.dragCanvas!.reset();
  }

  public repel(from: Point2d) {
    if (this.beingDragged) return;
    const current = new Square(this.current, this.squareSideSize);
    const avoid = new Square(from, this.auraSquareSideSize);
    if (!current.overlap(avoid)) return;

    const halfLetter = this.squareSideSize / 2;

    let x: number, y: number;

    if (avoid.topleft.equals(current.bottomright)) {
      // move top left
      x = avoid.topleft.x - halfLetter;
      y = avoid.topleft.y - halfLetter;
    } else if (avoid.topright.equals(current.bottomleft)) {
      // move top right
      x = avoid.topright.x + halfLetter;
      y = avoid.topright.y - halfLetter;
    } else if (avoid.bottomleft.equals(current.topright)) {
      // move bottom left
      x = avoid.bottomleft.x - halfLetter;
      y = avoid.bottomleft.y + halfLetter;
    } else if (avoid.bottomright.equals(current.topleft)) {
      // move bottom right
      x = avoid.bottomright.x + halfLetter;
      y = avoid.bottomright.y + halfLetter;
    }

    if (x! && y!) {
      this.current = new Point2d(x, y);
      this.setState(this.current.toStyle().toInlineCSS(this.inactiveZIndex, false));
      return;
    }

    const offset = this.auraSquareSideSize / 2 + halfLetter;
    const dir: Direction = relativeDirection(from, this.current);

    switch (dir) {
      case Direction.LEFT:
        x = from.x - offset;
        y = this.current.y;
        break;
      case Direction.RIGHT:
        x = from.x + offset;
        y = this.current.y;
        break;
      case Direction.UP:
        x = this.current.x;
        y = from.y - offset;
        break;
      case Direction.DOWN:
      default:
        x = this.current.x;
        y = from.y + offset;
        break;
    }

    // prevent out of bounds ...
    {
      const w = document.documentElement.offsetWidth,
        h = document.documentElement.offsetHeight;

      if (x <= this.squareSideSize) x = this.squareSideSize;
      else if (x >= w - this.squareSideSize) x = w - this.squareSideSize;

      if (y <= this.squareSideSize) y = this.squareSideSize;
      else if (y >= h - this.squareSideSize) y = h - this.squareSideSize;
    }

    this.current = new Point2d(x, y);
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
    this.references.forEach((char) => char.repel(this.current));
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
