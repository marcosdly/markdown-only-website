import { Point2d } from "./point2d";

export class Circle {
  public center: Point2d;
  public radius: number;

  public constructor(center: Point2d, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  public containsPoint(p: Point2d): boolean {
    return (p.x - this.center.x) ** 2 + (p.y - this.center.y) ** 2 <= this.radius ** 2;
  }
}
