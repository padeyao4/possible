import { OFFSET_ORIGIN_POINT } from '@/configs/constant'

export function normalX(x) {
  const offset = x >= 0 ? 60 : -60
  return (x - x % 120 + offset - OFFSET_ORIGIN_POINT.x)
}

export function normalY(y) {
  const offset = y >= 0 ? 30 : -30
  return (y - y % 60 + offset - OFFSET_ORIGIN_POINT.y)
}

export function toX(index) {
  const offset = index >= 0 ? 60 : -60
  return (offset + index * 120)
}

export function toY(index) {
  const offset = index >= 0 ? 30 : -30
  return (offset + index * 60)
}