export function normalX(x) {
  return x - x % 120 + 60
}

export function normalY(y) {
  return y - y % 60 + 30
}