export function normalX(x) {
  return x - x % 120 + 60
}

export function normalY(y) {
  return y - y % 60 + 30
}

export function toX(index) {
  return 60 + index * 120
}

export function toY(index) {
  return 30 + index * 60
}