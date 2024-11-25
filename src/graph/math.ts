export interface RectLike {
  x: number;
  y: number;
  w: number;
  h: number;
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