export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * `inside` is contained in a range `a - b` if `a <= inside <= b`.
 */
export function rangeContains(a: number, b: number, inside: number): boolean {
  return inside >= a && inside <= b;
}
