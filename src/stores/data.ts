import { defineStore } from 'pinia';

export type ID = string | number;

export type Point = {
  x: number;
  y: number;
};

export interface Project {
  id: ID;
  name: string;
  index: number; // 项目在项目列表中的排序,默认是创建时间毫秒值+随机数
  description: string;
  x: number; // 画布平移偏差值
  y: number; // 画布平移偏差值
}

export interface Node {
  id: ID;
  projectId: ID;
  name: string;
  detail: string;
  record: string;
  index: number; // 节点在项目中的排序,默认是创建时间毫秒值+随机数
  x: number; // 距离1970年的天数
  y: number;
  w: number;
  h: number;
  status: boolean; // true 表示完成
}

export interface Edge {
  id: ID;
  projectId: ID;
  source: ID | Point;
  target: ID | Point;
}

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
 * 生成唯一index,时间+随机数
 */
export function generateIndex() {
  return Date.now() * 100 + Math.floor(Math.random() * 100);
}

/**
 * 计算卡片锚点的坐标
 * source表示卡片右侧锚点，边的起点
 * @param node
 * @param cardWidth
 * @param cardHeight
 */
function sourceAnchor(node: Node, cardWidth: number, cardHeight: number) {
  const { x, y, w, h } = node;
  return {
    x: (x + w) * cardWidth - 10,
    y: (y + h / 2) * cardHeight
  };
}

/**
 * 计算卡片锚点的坐标
 * target表示卡片左侧锚点，边的终点
 * @param node
 * @param cardWidth
 * @param cardHeight
 */
function targetAnchor(node: Node, cardWidth: number, cardHeight: number) {
  const { x, y, h } = node;
  return {
    x: x * cardWidth + 10,
    y: (y + h / 2) * cardHeight
  };
}

/**
 * 计算边的控制点坐标,用于绘制曲线
 */
export interface PathDraw {
  id: ID;
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
  id: ID;
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

export const useGraph = defineStore('graph', {
  state: () => ({
    projectId: <ID>undefined, // 当前项目id
    projectsMap: new Map<ID, Project>(),
    nodesMap: new Map<ID, Node>(),
    edgesMap: new Map<ID, Edge>(),
    inEdgesMap: new Map<ID, Set<Edge>>(), // Map中的ID表示edge中的target,Set中的Edge表示所有指向该节点的边
    outEdgesMap: new Map<ID, Set<Edge>>(), // Map中的ID表示edge中的source,Set中的Edge表示所有从该节点出发的边
    viewWidth: 0, // 可视化窗口大小
    viewHeight: 0, // 可视化窗口大小
    menuWidth: 240, // 菜单栏宽度
    editorWidth: 0, // 编辑框宽度
    cardWidth: 120, // 实际卡片宽度
    cardHeight: 80 // 实际卡片高度
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
    getNodesByProjectId: (state) => (id: ID) => {
      return Array.from(state.nodesMap.values()).filter((node) => node.projectId === id);
    },
    getProjectById: (state) => (id: ID) => {
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
      const cardsMap = new Map<ID, CardDraw>();
      this.currentCards.forEach((card) => cardsMap.set(card.id, card));
      return Array.from(this.edgesMap.values())
        .filter((edge) => edge.projectId === this.projectId)
        .map((edge) => {
          const { x: sourceX, y: sourceY } =
            typeof edge.source === 'object'
              ? {
                  x: edge.source.x,
                  y: edge.source.y
                }
              : cardsMap.get(edge.source).anchor.source;

          const { x: targetX, y: targetY } =
            typeof edge.target === 'object'
              ? {
                  x: edge.target.x,
                  y: edge.target.y
                }
              : cardsMap.get(edge.target).anchor.target;

          const dist = targetX - sourceX;
          const controller1X = sourceX + dist / 2;
          const controller1Y = sourceY;
          const controller2X = targetX - dist / 2;
          const controller2Y = targetY;

          return {
            id: edge.id,
            sourceX,
            sourceY,
            targetX,
            targetY,
            controller1X,
            controller1Y,
            controller2X,
            controller2Y
          };
        });
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
    removeProject(item: ID | Project) {
      const id = typeof item === 'object' ? item.id : item;
      this.projectsMap.delete(id);
      // todo 删除所有关联的节点和边
    },
    setNode(node: Node) {
      this.nodesMap.set(node.id, node);
    },
    removeNode(item: ID | Node) {
      const id = typeof item === 'object' ? item.id : item;
      this.nodesMap.delete(id);
      // todo 删除所有关联的边
    },
    setEdge(edge: Edge) {
      this.edgesMap.set(edge.id, edge);
      // todo 添加出边和入边
    },
    removeEdge(item: ID | Edge) {
      const id = typeof item === 'object' ? item.id : item;
      this.edgesMap.delete(id);
    },
    setProjectId(id: ID) {
      this.projectId = id;
    }
  }
});
