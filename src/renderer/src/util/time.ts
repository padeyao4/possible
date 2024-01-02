import { DAY_OF_MS } from '@renderer/common/constant'

type D = Date | number | string

/**
 * 已本地时间作为标准时间，获取毫秒值
 * @param d
 */
export function localMs(d: D) {
  const o = new Date(d)
  return o.getTime() - o.getTimezoneOffset() * 60_000
}

/**
 * 本地时间到1970年的天数
 * @param d
 */
export function originIndex(d: D) {
  return Math.floor(localMs(d) / DAY_OF_MS)
}

/**
 * 根据两个本地时间获取 天数差
 * @param d
 * @param o
 */
export function dist(d: D, o: D) {
  return originIndex(d) - originIndex(o)
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

export function isNight() {
  const hours = new Date().getHours()
  return hours < 6 || hours > 18
}
