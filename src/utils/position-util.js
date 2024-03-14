export function normalX(x) {
  const offset = x >= 0 ? 60 : -60
  return x - x % 120 + offset
}

export function normalY(y) {
  const offset = y >= 0 ? 30 : -30
  return y - y % 60 + offset
}

export function toX(index) {
  const offset = index >= 0 ? 60 : -60
  return offset + index * 120
}

export function toY(index) {
  const offset = index >= 0 ? 30 : -30
  return offset + index * 60
}