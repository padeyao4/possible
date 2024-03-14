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

export function showWeek(date) {
  const arr = ['日', '一', '二', '三', '四', '五', '六']
  return '星期' + arr[new Date(date).getDay()]
}