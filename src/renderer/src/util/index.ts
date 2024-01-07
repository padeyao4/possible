import { DAY_OF_MS } from '@renderer/common/constant'
import { date2Day } from '@renderer/util/time'

/**
 * 将index还原为x点
 * @param index
 */
export const index2X = (index: number) => {
  return index * 120 + 60
}

/**
 * 将date转为index
 * @param date
 */
export function date2Index(date: Date) {
  return Math.floor(new Date(date).getTime() / DAY_OF_MS)
}

/**
 * 将日期转为x
 * @param current
 * @param base
 */
export function date2X(current: Date, base: Date) {
  const delta = date2Index(new Date(current)) - date2Index(new Date(base))
  return index2X(delta)
}

/**
 * 自定义日期格式化
 * @param date
 */
export function dateFormat(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function timeBarShow(n: number) {
  const date = new Date(n * DAY_OF_MS)
  return new Intl.DateTimeFormat('zh-Hans').format(date) + '\n' + date2Day(date)
}

export function viTest() {
  return 1
}
