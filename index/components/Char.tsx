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

/**
  * - Size dynamically increased according to max index.
  * - Index can be arbitrarilly set.
  * - **Must not be exported**.
  */
const globalState__charRefs: Char[] = [];

export class Char extends Component<CharOptions, PositionStyle> {
  private references = globalState__charRefs;
  private center: PositionStyle;

  constructor(props: CharOptions) {
    super(props);
    this.references[this.props.index] = this;
    this.center = this.pointToStyle(
      this.centerPoint(this.props.index, this.props.length),
    );
    this.state = this.center;
  }

  private spread() { }

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

  private pointToPosition(p: Point2d): Position {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight,
      top = p.y / h * 1e2,
      negativeX = p.x / w * 1e2;

    return { top: top, left: negativeX, x: 100 - negativeX, y: 100 - top };
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
