import { Point2d } from "./point2d";

export class Square {
  public center: Point2d;
  public edgeSize: number;
  public halfEdge: number;
  public topleft: Point2d;
  public topright: Point2d;
  public bottomleft: Point2d;
  public bottomright: Point2d;
  public left: Point2d;
  public right: Point2d;
  public top: Point2d;
  public bottom: Point2d;

  public constructor(center: Point2d, edgeSize: number) {
    this.center = center;
    this.edgeSize = edgeSize;
    this.halfEdge = edgeSize / 2;

    this.topleft = new Point2d(
      this.center.x - this.halfEdge,
      this.center.y - this.halfEdge,
    );
    this.topright = new Point2d(
      this.center.x + this.halfEdge,
      this.center.y - this.halfEdge,
    );
    this.bottomleft = new Point2d(
      this.center.x - this.halfEdge,
      this.center.y + this.halfEdge,
    );
    this.bottomright = new Point2d(
      this.center.x + this.halfEdge,
      this.center.y + this.halfEdge,
    );

    this.left = new Point2d(this.center.x - this.halfEdge, this.center.y);
    this.right = new Point2d(this.center.x + this.halfEdge, this.center.y);
    this.top = new Point2d(this.center.x, this.center.y - this.halfEdge);
    this.bottom = new Point2d(this.center.x, this.center.y + this.halfEdge);
  }

  public constainsPoint(p: Point2d): boolean {
    const horizontally = this.topleft.x <= p.x && this.bottomright.x >= p.x;
    const vertically = this.topleft.y <= p.y && this.bottomright.y >= p.y;
    return horizontally && vertically;
  }

  public overlap(other: Square): boolean {
    const thresholdDistance = this.edgeSize / 2 + other.edgeSize / 2;
    const horizontally =
      Math.max(this.center.x, other.center.x) - Math.min(this.center.x, other.center.x);
    const vertically =
      Math.max(this.center.y, other.center.y) - Math.min(this.center.y, other.center.y);

    return horizontally <= thresholdDistance && vertically <= thresholdDistance;
  }

  public equals(other: Square): boolean {
    return this.center.equals(other.center) && this.edgeSize === other.edgeSize;
  }
}
