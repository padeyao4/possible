/**
 * 将index还原为x点
 * @param index
 */
export const index2X = (index: number) => {
  return index * 120 + 60
}

export const x2Index = (x: number) => {
  return Math.floor(x / 120)
}

/**
 * 将x点正则化，统一x点
 * @param x
 */
export const normalX = (x: number) => {
  return Math.floor(x / 120) * 120 + 60
}

/**
 * 将dataIndex转为date
 * @param index
 */
export function index2Date(index: number) {
  return new Date((index + 19600) * 86400000)
}

export function dateFormat(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

/**
 * 获取星期
 * @param date
 */
export function date2Day(date: Date) {
  const mapper = {
    '0': '日',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六'
  }
  return mapper[date.getDay()]
}
