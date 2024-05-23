import { Point2d } from "./point2d";

export interface PositionCSS {
  left: string;
  top: string;
  transform: string;
  zIndex: string;
}

export class Style {
  public top: number;
  public left: number;
  public x: number;
  public y: number;

  public constructor(position: Point2d) {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    this.top = (position.y / h) * 1e2;
    this.left = (position.x / w) * 1e2;
    this.x = 100 - this.left;
    this.y = 100 - this.top;
  }

  public toInlineCSS(zIndex: number): PositionCSS {
    return {
      top: `${this.top}%`,
      left: `${this.left}%`,
      transform: `translate(-${this.x}%, -${this.y}%)`,
      zIndex: zIndex.toString(),
    };
  }
}
