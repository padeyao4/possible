import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
// import { Project } from '@/core';

export const ONE_DAY_MS = 86400_000;
export const ONE_MINUTE_MS = 60_000;
export type DateType = Date | string | number;

export function showWeek(date: Date | number): string {
  const arr = ['日', '一', '二', '三', '四', '五', '六'];
  return '周' + arr[new Date(date).getDay()];
}

export function showWeekAndLocalDate(dateStr: string | number) {
  const date = new Date(dateStr);
  const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dayIndex = adjustedDate.getDay();
  const localDate = adjustedDate.toLocaleDateString();
  return `${localDate} ${days[dayIndex]}`;
}

function days(date: Date | number | string) {
  const d = new Date(date);
  return Math.ceil((d.getTime() - d.getTimezoneOffset() * ONE_MINUTE_MS) / ONE_DAY_MS);
}

/**
 * 获取日期距离1970的天数
 * @param date
 */
export function getDays(date: Date) {
  return Math.ceil((date.getTime() - date.getTimezoneOffset() * ONE_MINUTE_MS) / ONE_DAY_MS);
}

/**
 * 计算两个日期之间相差的天数
 * @param startDate
 * @param endDate
 */
export function getDaysBetweenDates(
  startDate: Date | number | string,
  endDate: Date | number | string
): number {
  return days(startDate) - days(endDate);
}

// export function getIndexByDate(project: Partial<Project>): number {
//   const timer = useTimer();
//   return getDaysBetweenDates(timer.timestamp, project.createTime);
// }

export function scheduleMidnightTask(clear: Ref<any>, callback: () => void) {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const delay: number = midnight.getTime() - now.getTime();
  clearTimeout(clear.value);
  clear.value = setTimeout(() => {
    callback();
    // 设置下一个午夜的定时器
    scheduleMidnightTask(clear, callback);
  }, delay);
}

// export const useTimer = defineStore('timestamp', () => {
//   const timestamp = ref(new Date().valueOf());
//
//   const localTimestamp = computed(() => {
//     const d = new Date(timestamp.value);
//     return d.getTime() - d.getTimezoneOffset() * ONE_MINUTE_MS;
//   });
//
//   const currentDays = computed(() => {
//     return days(timestamp.value);
//   });
//
//   function update() {
//     timestamp.value = new Date().valueOf();
//   }
//
//   function $reset() {}
//
//   return {
//     timestamp,
//     localTimestamp,
//     currentDays,
//     update,
//     $reset
//   };
// });

export const useTime = defineStore('time', {
  state: () => ({
    timestamp: 0
  }),

  getters: {
    localTimestamp: (state) => {
      const d = new Date(state.timestamp);
      return d.getTime() - d.getTimezoneOffset() * ONE_MINUTE_MS;
    },
    currentDays: (state) => {
      return getDays(new Date(state.timestamp));
    }
  }
});
