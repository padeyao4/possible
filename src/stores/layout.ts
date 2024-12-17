import { defineStore } from 'pinia';

/**
 * 一天的表示的毫秒值
 */
export const ONE_DAY_MS = 86400_000;
/**
 * 一分钟毫秒值
 */
export const ONE_MINUTE_MS = 60_000;

export type DateType = Date | string | number;

export interface RectLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 判断两个矩形是否相交
 * @param rect1
 * @param rect2
 */
export function cross(rect1: RectLike, rect2: RectLike): boolean {
  const { x: x1, y: y1, width: w1, height: h1 } = rect1;
  const { x: x2, y: y2, width: w2, height: h2 } = rect2;
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

/**
 * 生成唯一index,时间毫秒值
 */
export function generateIndex() {
  return Date.now();
}

/**
 * 获取日期距离1970的天数
 */
export function days(dateType: DateType) {
  const date = typeof dateType === 'object' ? dateType : new Date(dateType);
  return Math.ceil((date.getTime() - date.getTimezoneOffset() * ONE_MINUTE_MS) / ONE_DAY_MS);
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    menuWidth: 260, // 菜单栏宽度
    menuVisible: true, // 菜单栏是否显示
    editorWidth: 300, // 编辑框宽度
    editorVisible: false, // 编辑框是否显示
    loading: false, // 加载状态
    timestamp: Date.now() // 时间戳,用于控制表头显示的时间格式
  }),
  getters: {
    gridTemplateColumns: (state) => {
      const menuStyle = state.menuVisible ? `${state.menuWidth}px` : '';
      const editorStyle = state.editorVisible ? `${state.editorWidth}px` : '';
      return { gridTemplateColumns: `${menuStyle} 1fr ${editorStyle}` };
    },
    /**
     * 根据当前时间戳获取画布index坐标
     * @param state
     */
    currentIndex: (state) => {
      return days(state.timestamp);
    },
  },
});
