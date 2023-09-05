export function getProjectId() {
  const data = window.location.pathname.split('/')
  return data[data.length - 1]
}

export const index2X = (index: number) => {
  return index * 120 + 60
}

export const x2Index = (x: number) => {
  return Math.floor(x / 120)
}

export const normalX = (x: number) => {
  return Math.floor(x / 120) * 120 + 60
}
