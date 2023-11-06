import {DAY_OF_MS} from "@renderer/util/constant";

type D = Date | number | string

/**
 * 已本地时间作为标准时间，获取毫秒值
 * @param d
 */
export function getZoneTimeMs(d: D) {
  const o = new Date(d)
  return o.getTime() - o.getTimezoneOffset() * 60_000
}

/**
 * 本地时间到1970年的天数
 * @param d
 */
export function getOriginIndex(d: D) {
  return Math.floor(getZoneTimeMs(d) / DAY_OF_MS)
}

/**
 * 根据两个本地时间获取 天数差
 * @param d
 * @param o
 */
export function deltaIndex(d: D, o: D) {
  return getOriginIndex(d) - getOriginIndex(o)
}
