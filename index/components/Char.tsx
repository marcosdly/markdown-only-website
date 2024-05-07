import { Component } from "preact";

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
  public current: Point2d;

  constructor(props: CharOptions) {
    super(props);
    this.references[this.props.index] = this;
    this.current = this.centerPoint(this.props.index, this.props.length);
    this.center = this.pointToStyle(this.current);
    this.state = this.center;
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

  private gatter() {
    this.references.forEach((char) => char.resetPosition());
  }

  public resetPosition() {
    this.setState(this.center);
  }

  private centerPoint(index: number, length: number): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    return { x: w / (length + 1) * (index + 1), y: h / 2 };
  }

  private randomInRange(min: number, max:number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private arbitraryPoint(): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;
    return { x: this.randomInRange(1, w), y: this.randomInRange(1, h) };
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
    const square = this.pointToSquare(overlaped, 32);
    const overlapping = this.pointToSquare(overlaps, 32);
    return (
      this.squareContainsPoint(overlapping.topLeft, square)
      || this.squareContainsPoint(overlapping.topRight, square)
      || this.squareContainsPoint(overlapping.bottomLeft, square)
      || this.squareContainsPoint(overlapping.bottomRight, square)
    );
  }

  private pointToStyle(p: Point2d): PositionStyle {
    const pos = this.pointToPosition(p);
    return {
      top: `${pos.top}%`,
      left: `${pos.left}%`,
      transform: `translate(-${pos.x}%, -${pos.y}%)`,
    };
  }

  render() {
    return (
      <div
        className="char"
        onMouseEnter={() => this.spread()}
        onMouseLeave={() => this.gatter()}
        style={this.state}
      >
        <a className="char-link" href={this.props.href}>
          {this.props.letter}
        </a>
      </div>
    );
  }
}
