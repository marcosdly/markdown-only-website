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
    this.center = this.positionStyle(
      this.centerPosition(this.props.index, this.props.length),
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

  private centerPosition(index: number, length: number): Position {
    const w = document.documentElement.offsetWidth,
      columnCenter = w / (length + 1) / w * 1e2,
      left = columnCenter * (index + 1);

    return { top: 50, left: left, x: 100 - left, y: 50 };
  }

  private positionStyle(props: Position): PositionStyle {
    return {
      top: `${props.top}%`,
      left: `${props.left}%`,
      transform: `translate(-${props.x}%, -${props.y}%)`,
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
