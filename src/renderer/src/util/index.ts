import { IBBox } from '@antv/g6-core'

/**
 * 一天等于86400000秒
 */
const dayOfSeconds = 86400000

/**
 * 将index还原为x点
 * @param index
 */
export const index2X = (index: number) => {
  return index * 120 + 60
}

/**
 * x点转index
 * @param x
 */
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
 * 将index转为date
 * @param index
 */
export function index2Date(index: number) {
  if (isNaN(index)) {
    return new Date()
  } else {
    return new Date(index * dayOfSeconds)
  }
}

/**
 * 将date转为index
 * @param date
 */
export function date2Index(date: Date) {
  return Math.floor(date.valueOf() / dayOfSeconds)
}

/**
 * 自定义日期格式化
 * @param date
 */
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
  return '星期' + mapper[date.getDay()]
}

/**
 * 判断两个盒子是否碰撞
 * @param b1
 * @param b2
 * @param paddingX
 * @param paddingY
 */
export function collision(b1: IBBox, b2: IBBox, paddingX = 0, paddingY = 0) {
  return !(
    b1.x > b2.x + b2.width + paddingX ||
    b1.x + b1.width + paddingX < b2.x ||
    b1.y > b2.y + b2.height + paddingY ||
    b1.y + b1.height + paddingY < b2.y
  )
}

/**
 * 添加天数
 * @param base
 * @param n
 */
export function dateAdd(base: Date | string | number, n: number) {
  return new Date(new Date(base).getTime() + n * dayOfSeconds)
}

export function timeBarShow(base: Date | string | number, n: number) {
  const date = dateAdd(base, n)
  return new Intl.DateTimeFormat('zh-Hans').format(date) + '\n' + date2Day(date)
}
