import { randomInRange } from "../../lib/mathTools";
import { Style } from "./style";

export class Point2d {
  private _x: number;
  private _y: number;

  public constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  /**
   * Returns a random point `p` where `offset <= p.x <= x - offset` and `x` is
   * either `width` or `height`.
   */
  public static random(width: number, height: number, offset: number): Point2d {
    return new this(
      randomInRange(offset, width - offset),
      randomInRange(offset, height - offset),
    );
  }

  public static fromObject(obj: any): Point2d {
    return new this(obj.x, obj.y);
  }

  public equals(other: Point2d): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public toStyle() {
    return new Style(this);
  }
}
