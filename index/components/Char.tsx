import { Component, RefObject, createRef } from "preact";
import { DragState } from "../dragState";

interface CharOptions {
  letter: string;
  href: string;
  index: number;
  length: number;
}

interface Position {
  top: number;
  left: number;
  x: number;
  y: number;
}

interface PositionStyle {
  top: string;
  left: string;
  transform: string;
  zIndex: string;
  transition: "unset" | undefined;
}

interface Point2d {
  x: number;
  y: number;
}

/** A square's vertices */
interface Square {
  topLeft: Point2d;
  bottomLeft: Point2d;
  topRight: Point2d;
  bottomRight: Point2d;
}

/**
  * - Size dynamically increased according to max index.
  * - Index can be arbitrarilly set.
  * - **Must not be exported**.
  */
const globalState__charRefs: Char[] = [];

export class Char extends Component<CharOptions, PositionStyle> {
  private references = globalState__charRefs;
  private center: PositionStyle;
  private centerPoint: Point2d;
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
    this.centerPoint = this.getCenterPoint();
    this.center = this.pointToStyle(this.centerPoint);
    this.current = this.centerPoint;
    this.state = this.center;
    this.beingDragged = false;
  }

  private spread() {
    this.references.forEach((char) => {
      if (char.props.index === this.props.index) return;
      let p: Point2d;
      do
        p = this.arbitraryPoint();
      while (this.references.some(
        (c) => this.squaresAroundOverlap(p, c.current)
      ));
      char.current = p;
      char.setState(this.pointToStyle(p));
    });
  }

  public gatter() {
    this.references.forEach((char) => char.resetPosition());
  }

  public resetPosition() {
    this.beingDragged = false;
    this.current = this.centerPoint;
    this.setState(this.center);
  }

  private getCenterPoint(): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    return { x: w / (this.props.length + 1) * (this.props.index + 1), y: h / 2 };
  }

  private randomInRange(min: number, max:number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private arbitraryPoint(): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;
    return { x: this.randomInRange(this.squareSideSize, w - this.squareSideSize), y: this.randomInRange(this.squareSideSize, h - this.squareSideSize) };
  }

  private pointToPosition(p: Point2d): Position {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight,
      top = p.y / h * 1e2,
      negativeX = p.x / w * 1e2;

    return { top: top, left: negativeX, x: 100 - negativeX, y: 100 - top };
  }

  private pointToSquare(center: Point2d, sideLengthPx: number): Square {
    const half = sideLengthPx / 2;
    return {
      topLeft: { x: center.x - half, y: center.y - half },
      bottomLeft: { x: center.x - half, y: center.y + half },
      topRight: { x: center.x + half, y: center.y - half },
      bottomRight: { x: center.x + half, y: center.y + half },
    };
  }

  /** Assume square isn't rotated in any way! */
  private squareContainsPoint(p: Point2d, sqr: Square): boolean {
    const horizontaly = sqr.topLeft.x <= p.x && sqr.topRight.x >= p.x;
    const verticaly = sqr.topLeft.y <= p.y && sqr.bottomLeft.y >= p.y;
    return horizontaly && verticaly;
  }

  private squaresAroundOverlap(overlaped: Point2d, overlaps: Point2d): boolean {
    const square = this.pointToSquare(overlaped, this.squareSideSize);
    const overlapping = this.pointToSquare(overlaps, this.squareSideSize);
    return (
      this.squareContainsPoint(overlapping.topLeft, square)
      || this.squareContainsPoint(overlapping.topRight, square)
      || this.squareContainsPoint(overlapping.bottomLeft, square)
      || this.squareContainsPoint(overlapping.bottomRight, square)
    );
  }

  private pointToStyle(p: Point2d, above: boolean = false): PositionStyle {
    const pos = this.pointToPosition(p);
    const anyBeingDragged = this.beingDragged || this.references.some((char) => char.beingDragged);
    return {
      top: `${pos.top}%`,
      left: `${pos.left}%`,
      transform: `translate(-${pos.x}%, -${pos.y}%)`,
      zIndex: above ? this.activeZIndex.toString() : this.inactiveZIndex.toString(),
      transition: anyBeingDragged ? "unset" : undefined,
    };
  }

  private onMouseEnter() {
    if (this.references.some((char) => char.beingDragged)) return;
    const elemBox = this.charBox.current!.getBoundingClientRect();
    const currentPoint: Point2d = {x: this.squareSideSize / 2 + elemBox.x, y: this.squareSideSize / 2 + elemBox.y};
    const style = this.pointToStyle(currentPoint, true);
    this.current = currentPoint;
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
    const current = this.pointToSquare(this.current, this.squareSideSize);
    const avoid = this.pointToSquare(from, this.auraSquareSideSize);
    if (!this.squareContainsPoint(this.current, avoid)) return;

    const halfLetter = this.squareSideSize / 2;
    const pointsAreEqual = (p1: Point2d, p2: Point2d) => p1.x === p2.x && p1.y === p2.y;

    let x: number, y: number;

    if (pointsAreEqual(avoid.topLeft, current.bottomRight)) {
      // move top left
      x = avoid.topLeft.x - halfLetter;
      y = avoid.topLeft.y - halfLetter;
    } else if (pointsAreEqual(avoid.topRight, current.bottomLeft)) {
      // move top right
      x = avoid.topRight.x + halfLetter;
      y = avoid.topRight.y - halfLetter;
    } else if (pointsAreEqual(avoid.bottomLeft, current.topRight)) {
      // move bottom left
      x = avoid.bottomLeft.x - halfLetter;
      y = avoid.bottomLeft.y + halfLetter;
    } else if (pointsAreEqual(avoid.bottomRight, current.topLeft)) {
      // move bottom right
      x = avoid.bottomRight.x + halfLetter;
      y = avoid.bottomRight.y + halfLetter;
    }

    if (x! && y!) {
      this.current = { x: x, y: y };
      this.setState(this.pointToStyle(this.current));
      return;
    }

    const offset = this.auraSquareSideSize / 2 + halfLetter;

    interface Cross {
      up: number;
      down: number;
      left: number;
      right: number;
    }

    const letterCross: Cross = {
      left: this.current.x - halfLetter,
      right: this.current.x + halfLetter,
      up: this.current.y - halfLetter,
      down: this.current.y + halfLetter,
    };

    if (letterCross.right <= from.x) {
      // move left
      x = from.x - offset;
      y = this.current.y;
    } else if (letterCross.left >= from.x) {
      // move right
      x = from.x + offset;
      y = this.current.y;
    } else if (letterCross.down <= from.y) {
      // move up
      x = this.current.x;
      y = from.y - offset;
    } else {
      // move down
      x = this.current.x;
      y = from.y + offset;
    }

    this.current = { x: x, y: y };
    this.setState(this.pointToStyle(this.current));
  }

  public drag(ev: MouseEvent | Point2d) {
    if (!this.beingDragged) return;

    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    let x: number, y: number;

    if (ev.x >= w - this.squareSideSize)
      x = w - this.squareSideSize;
    else if (ev.x <= this.squareSideSize)
      x = this.squareSideSize;
    else
      x = ev.x;

    if (ev.y >= h - this.squareSideSize)
      y = h - this.squareSideSize;
    else if (ev.y <= this.squareSideSize)
      y = this.squareSideSize;
    else
      y = ev.y;

    this.current = { x: x, y: y };
    this.setState(this.pointToStyle(this.current, true));
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
