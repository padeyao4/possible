export interface RectLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function isCross(rect1: RectLike, rect2: RectLike): boolean {
  const { x: x1, y: y1, width: w1, height: h1 } = rect1
  const { x: x2, y: y2, width: w2, height: h2 } = rect2

  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  )
}

export function clampMin(n: number, min: number) {
  return n >= min ? n : min
}

export function clampMax(n: number, max: number) {
  return n <= max ? n : max
}

export function clamp(n: number, min: number, max: number) {
  if (min > max) return min
  if (n <= min) return min
  if (n >= max) return max
  return n
}