import { randomInRange } from "../../lib/mathTools";
import { Point2d } from "./point2d";

export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
  NONE = "none",
}

export function randomDirection(): Direction {
  switch (randomInRange(0, 3)) {
    case 0:
      return Direction.LEFT;
    case 1:
      return Direction.RIGHT;
    case 2:
      return Direction.UP;
    case 3:
    default:
      return Direction.DOWN;
  }
}

export function relativeDirection(base: Point2d, relative: Point2d): Direction {
  let x: Direction, y: Direction;

  if (relative.x < base.x) x = Direction.LEFT;
  else if (relative.x > base.x) x = Direction.RIGHT;
  else x = Direction.NONE;

  if (relative.y < base.y) y = Direction.UP;
  else if (relative.y > base.y) y = Direction.DOWN;
  else y = Direction.NONE;

  const xDiff = Math.max(base.x, relative.x) - Math.min(base.x, relative.x);
  const yDiff = Math.max(base.y, relative.y) - Math.min(base.y, relative.y);

  if (x === Direction.NONE && y === Direction.NONE) return Direction.NONE;
  else if (x === Direction.NONE) return y;
  else if (y === Direction.NONE) return x;
  else if (xDiff < yDiff) return x;
  else return y;
}
