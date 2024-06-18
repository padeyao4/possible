import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import { useProjectStore } from './project';
import Project from '@/core/Project';
import type Node from '@/core/Node';

export function showWeek(date: Date | number): string {
  const arr = ['日', '一', '二', '三', '四', '五', '六'];
  return '周' + arr[new Date(date).getDay()];
}

export function showWeekAndLocalDate(dateStr: string | number) {
  const date = new Date(dateStr);
  const adjustedDate = new Date(date.getTime());
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dayIndex = adjustedDate.getDay();
  const localDate = adjustedDate.toLocaleDateString();

  return `${localDate} ${days[dayIndex]}`;
}

export const timeFormat = new Intl.DateTimeFormat('zh-Hans');

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_MINUTE_MS = 60_000;

export function days(date: Date | number | string) {
  const d = new Date(date);
  return Math.ceil((d.getTime() - d.getTimezoneOffset() * ONE_MINUTE_MS) / ONE_DAY_MS);
}

export function getDaysBetweenDates(
  startDate: Date | number | string,
  endDate: Date | number | string
): number {
  return days(startDate) - days(endDate);
}

export function getIndexByDate(project: Project): number {
  const timer = useTimer();
  return getDaysBetweenDates(timer.timestamp, project.createTime);
}

export function getIndex(node: Node) {
  const projects = useProjectStore();
  const project = projects.getProjectByNode(node);
  return node.x + getDaysBetweenDates(project.createTime, 0);
}

export function scheduleMidnightTask(clear: Ref<any>, callback: () => void) {
  const now: Date = new Date();
  const midnight: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const delay: number = midnight.getTime() - now.getTime();
  clearTimeout(clear.value);
  clear.value = setTimeout(() => {
    callback();
    // 设置下一个午夜的定时器
    scheduleMidnightTask(clear, callback);
  }, delay);
}

export const useTimer = defineStore('timestamp', () => {
  const timestamp = ref(new Date().valueOf());

  const localTimestamp = computed(() => {
    const d = new Date(timestamp.value);
    return d.getTime() - d.getTimezoneOffset() * ONE_MINUTE_MS;
  });

  const currentDays = computed(() => {
    return days(timestamp.value);
  });

  function update() {
    timestamp.value = new Date().valueOf();
  }

  return {
    timestamp,
    localTimestamp,
    currentDays,
    update
  };
});
