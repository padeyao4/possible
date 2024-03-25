import { toX } from '@/utils/position-util.js'

/**
 * 将utc时间转本地时间。计算距离1970.1.1的日期天数
 * @param timestamp
 */
export function convertToIndex(timestamp) {
  const utcDate = new Date(timestamp)
  const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
  const delta = localDate.getTime() / 86400_000
  return Math.floor(delta)
}

export function convertToDate(index) {
  return new Date(index * 86400_000)
}

/**
 * 两个时间相差的天数转换为x轴距离
 * @param timestamp1
 * @param timestamp2
 * @returns {number}
 */
export function dateToX(timestamp1, timestamp2) {
  const delta = convertToIndex(timestamp1) - convertToIndex(timestamp2)
  return toX(delta)
}

export function showWeek(date) {
  const arr = ['日', '一', '二', '三', '四', '五', '六']
  return '星期' + arr[new Date(date).getDay()]
}