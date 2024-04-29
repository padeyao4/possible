import { OFFSET_ORIGIN_POINT, HALF_UNIT_W, HALF_UNIT_H, UNIT_W, UNIT_H } from '@/configs/constant'

export function normalX(x: number) {
  x += OFFSET_ORIGIN_POINT.x
  const halfWidth = x >= 0 ? HALF_UNIT_W : -HALF_UNIT_W
  return x - x % UNIT_W + halfWidth - OFFSET_ORIGIN_POINT.x
}


export function normalY(y: number) {
  y += OFFSET_ORIGIN_POINT.y
  const halfHeight = y >= 0 ? HALF_UNIT_H : -HALF_UNIT_H
  return y - y % UNIT_H + halfHeight - OFFSET_ORIGIN_POINT.y
}

export function toX(index: number) {
  const offset = index >= 0 ? HALF_UNIT_W : -HALF_UNIT_W
  return (offset + index * UNIT_W)
}

export function toY(index: number) {
  const offset = index >= 0 ? HALF_UNIT_H : -HALF_UNIT_H
  return (offset + index * UNIT_H)
}