/**
 * 已本地时间作为标准时间，获取毫秒值
 * @param d
 */
export function getZoneTimeMs(d: Date | number | string) {
  const o = new Date(d)
  return o.getTime() - o.getTimezoneOffset() * 60_000
}
