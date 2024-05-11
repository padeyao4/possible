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


export function isPointInRectangle(point: { x: number; y: number }, rectangle: {
  x: number;
  y: number;
  width: number;
  height: number
}) {
  const { x: pointX, y: pointY } = point
  const { x: rectX, y: rectY, width: rectWidth, height: rectHeight } = rectangle

  return (
    pointX >= rectX &&
    pointX <= rectX + rectWidth &&
    pointY >= rectY &&
    pointY <= rectY + rectHeight
  )
}

export function isBetween(min: number, n: number, max: number) {
  return min <= n && n <= max
}

export function getDirection(rect: any, point: MouseEvent) {
  const { left, right, top, bottom } = rect
  const { x, y } = point
  if (isBetween(left, x, left + 5) && isBetween(top, y, top + 5)) {
    return 'lt'
  }
  if (isBetween(right - 5, x, right) && isBetween(top, y, top + 5)) {
    return 'rt'
  }
  if (isBetween(left, x, left + 5) && isBetween(bottom - 5, y, bottom)) {
    return 'lb'
  }
  if (isBetween(right - 5, x, right) && isBetween(bottom - 5, y, bottom)) {
    return 'rb'
  }
  if (isBetween(left, x, left + 5)) {
    return 'l'
  }
  if (isBetween(right - 5, x, right)) {
    return 'r'
  }
  if (isBetween(top, y, top + 5)) {
    return 't'
  }
  if (isBetween(bottom - 5, y, bottom)) {
    return 'b'
  }
  return 'none'
}