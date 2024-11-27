export interface RectLike {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function clampMin(n: number, min: number) {
  return n >= min ? n : min;
}

export function clampMax(n: number, max: number) {
  return n <= max ? n : max;
}
