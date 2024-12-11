import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { DataStoreControllerApi, type Edge, type Project, type Node } from '@/openapi';

/**
 * 一天的表示的毫秒值
 */
export const ONE_DAY_MS = 86400_000;
/**
 * 一分钟毫秒值
 */
export const ONE_MINUTE_MS = 60_000;

export type DateType = Date | string | number;

export type Point = {
  x: number;
  y: number;
};

export interface RectLike {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * 判断两个矩形是否相交
 * @param rect1
 * @param rect2
 */
export function cross(rect1: RectLike, rect2: RectLike): boolean {
  const { x: x1, y: y1, w: w1, h: h1 } = rect1;
  const { x: x2, y: y2, w: w2, h: h2 } = rect2;
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
/**
 * 计算边的控制点坐标,用于绘制曲线
 */
export interface PathDraw {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  controller1X: number;
  controller1Y: number;
  controller2X: number;
  controller2Y: number;
}

export interface CardDraw {
  id: string;
  name: string;
  x: number; // 实际x点
  y: number; // 实际y点
  w: number; // 实际宽度
  h: number; // 实际高度
  anchor: {
    source: {
      // 卡片右侧锚点
      x: number;
      y: number;
    };
    target: {
      // 卡片左侧锚点
      x: number;
      y: number;
    };
  };
  color: string; // 根据状态设置颜色
}

interface TempEdge {
  id: string;
  source: string | Point;
  target: string | Point;
  projectId: string;
}

/**
 * 媒体晚上12点钟执行
 * @param clear
 * @param callback
 */
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

export const useDataStore = defineStore('graph', {
  state: () => ({
    projectId: <string>undefined, // 当前项目id
    projectsMap: new Map<string, Project>(),
    tempEdge: <TempEdge>undefined, // 临时边
    nodesMap: new Map<string, Node>(),
    edgesMap: new Map<string, Edge>(),
    inEdgesMap: new Map<string, Set<Edge>>(), // Map中的ID表示edge中的target,Set中的Edge表示所有指向该节点的边
    outEdgesMap: new Map<string, Set<Edge>>(), // Map中的ID表示edge中的source,Set中的Edge表示所有从该节点出发的边
    viewWidth: 0, // 可视化窗口大小
    viewHeight: 0, // 可视化窗口大小
    menuWidth: 240, // 菜单栏宽度
    editorWidth: 0, // 编辑框宽度
    cardWidth: 120, // 实际卡片宽度
    cardHeight: 80, // 实际卡片高度
    loading: false, // 加载状态
    timestamp: Date.now() // 时间戳,用于控制表头显示的时间格式
  }),
  getters: {
    project: (state) => {
      return state.projectsMap.get(state.projectId);
    },
    projects: (state) => Array.from(state.projectsMap.values()) /**
     * 获取排序后的所有项目
     * @param state
     */,
    sortedProjects: (state) => {
      return Array.from(state.projectsMap.values()).sort((a, b) => a.index - b.index);
    },
    getNodesByProjectId: (state) => (id: string) => {
      return Array.from(state.nodesMap.values()).filter((node) => node.projectId === id);
    },
    getProjectById: (state) => (id: string) => {
      return state.projectsMap.get(id);
    } /**
     * canvas中用于显示图形的区域大小
     * @param state
     */,
    viewBounds: (state) => {
      const project = state.projectsMap.get(state.projectId);
      return {
        x: -project.x,
        y: -project.y,
        w: state.viewWidth,
        h: state.viewHeight
      };
    },

    /**
     * 根据项目id获取待绘制卡片信息,所有当前项目下的卡片数据
     */
    currentCards(): CardDraw[] {
      const cards = Array.from(this.nodesMap.values())
        .filter((node) => node.projectId === this.projectId)
        .sort((a, b) => a.x - b.x)
        .map((node) => {
          const x = node.x * this.cardWidth + 10;
          const y = node.y * this.cardHeight + 10;
          const w = node.w * this.cardWidth - 10 * 2;
          const h = node.h * this.cardHeight - 10 * 2;
          return {
            id: node.id,
            name: node.name,
            x, // 实际x点
            y, // 实际y点
            w, // 实际宽度
            h, // 实际高度
            color: node.status ? '#dddddd' : '#fff' // 根据状态设置颜色
          };
        });
      const nodesMap = new Map<string, any[]>();
      cards.forEach((card) => {
        const key = `${card.x}-${card.y}`;
        if (nodesMap.has(key)) {
          nodesMap.get(key).push(card);
        } else {
          nodesMap.set(key, [card]);
        }
      });

      Array.from(nodesMap.values()).forEach((item) => {
        if (item.length > 1) {
          item.forEach((card, index) => {
            card.x = card.x + index * 3;
            card.y = card.y + index * 3;
          });
        }
      });

      return cards.map((card) => {
        return {
          ...card,
          anchor: {
            source: {
              // 卡片右侧锚点
              x: card.x + card.w,
              y: card.y + card.h / 2
            },
            target: {
              // 卡片左侧锚点
              x: card.x,
              y: card.y + card.h / 2
            }
          }
        };
      });
    },
    /**
     * 根据显示区域裁剪后的用于显示的卡片数据
     */
    drawableCards(): CardDraw[] {
      return this.currentCards.filter((card) => cross(this.viewBounds, card));
    },
    /**
     * 根据项目id获取所有边绘制信息
     */
    currentPaths(): PathDraw[] {
      const cardsMap = new Map<string, CardDraw>();
      this.currentCards.forEach((card) => cardsMap.set(card.id, card));

      const ans = [];

      if (this.tempEdge?.projectId === this.projectId) {
        const { x: sourceX, y: sourceY } =
          typeof this.tempEdge.source === 'string'
            ? cardsMap.get(this.tempEdge.source).anchor.source
            : this.tempEdge.source;
        const { x: targetX, y: targetY } =
          typeof this.tempEdge.target === 'string'
            ? cardsMap.get(this.tempEdge.target).anchor.target
            : this.tempEdge.target;
        const dist = targetX - sourceX;
        const tmpPath = {
          id: this.tempEdge.id,
          sourceX,
          sourceY,
          targetX,
          targetY,
          controller1X: sourceX + dist / 2,
          controller1Y: sourceY,
          controller2X: targetX - dist / 2,
          controller2Y: targetY
        };
        ans.push(tmpPath);
      }

      const realsPath = Array.from(this.edgesMap.values())
        .filter((edge) => edge.projectId === this.projectId)
        .map((edge) => {
          const { x: sourceX, y: sourceY } = cardsMap.get(edge.source).anchor.source;
          const { x: targetX, y: targetY } = cardsMap.get(edge.target).anchor.target;
          const dist = targetX - sourceX;
          return {
            id: edge.id,
            sourceX,
            sourceY,
            targetX,
            targetY,
            controller1X: sourceX + dist / 2,
            controller1Y: sourceY,
            controller2X: targetX - dist / 2,
            controller2Y: targetY
          };
        });
      return ans.concat(realsPath);
    },
    gridTemplateColumns: (state) => {
      if (state.editorWidth !== 0) {
        return { gridTemplateColumns: `${state.menuWidth}px 1fr ${state.editorWidth}px` };
      } else {
        return { gridTemplateColumns: `${state.menuWidth}px 1fr` };
      }
    }
  },
  actions: {
    setProject(project: Project) {
      this.projectsMap.set(project.id, project);
    },
    removeProject(item: string | Project) {
      const string = typeof item === 'object' ? item.id : item;
      this.projectsMap.delete(string);
      this.edgesMap.forEach((value, key, map) => {
        value.projectId === string && this.edgesMap.delete(key);
      });
      this.nodesMap.forEach((value, key, map) => {
        value.projectId === string && this.nodesMap.delete(key);
      });
    },
    setNode(node: Node) {
      this.nodesMap.set(node.id, node);
    },
    removeNode(item: string | Node) {
      const string = typeof item === 'object' ? item.id : item;
      this.edgesMap.forEach((value, key, map) => {
        (typeof value.source === string || typeof value.target === string) &&
          this.edgesMap.delete(key);
      });
      this.nodesMap.delete(string);
      // todo 删除所有关联的边
    },
    setEdge(edge: Edge) {
      this.edgesMap.set(edge.id, edge);
      // todo 添加出边和入边
    },
    removeEdge(item: string | Edge) {
      const string = typeof item === 'object' ? item.id : item;
      this.edgesMap.delete(string);
    },
    setProjectId(id: string) {
      this.projectId = id;
    },
    /**
     * 根据改变当前项目坐标
     */
    setCurrentProjectPositionByDate(dateType: DateType) {
      const offsetX = -days(dateType) * this.cardWidth;
      this.project.x = offsetX > 0 ? offsetX - 1 : offsetX;
      this.project.y = 0;
    },
    fetch() {
      this.loading = true;
      new DataStoreControllerApi()
        .list()
        .then((res) => {
          const { projects, edges, nodes } = res.data.payload;
          this.nodesMap.clear();
          this.edgesMap.clear();
          this.projectsMap.clear();
          projects.forEach((project) => this.projectsMap.set(project.id, project));
          edges.forEach((edge) => this.edgesMap.set(edge.id, edge));
          nodes.forEach((node) => this.nodesMap.set(node.id, node));
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
});
