import { defineStore } from 'pinia';
import { v4 } from 'uuid';

export type ID = string | number;

export interface Project {
  id: ID;
  name: string;
  index: number;
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
  x: number; // 距离1970年的天数
  y: number;
  w: number;
  h: number;
  status: boolean; // true 表示完成
}

export interface Edge {
  id: ID;
  projectId: ID;
  source: ID;
  target: ID;
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

export const useGraph = defineStore('graph', {
  state: () => ({
    projectId: <ID>undefined,
    projectsMap: new Map<ID, Project>(),
    nodesMap: new Map<ID, Node>(),
    edgesMap: new Map<ID, Edge>(),
    inEdgesMap: new Map<ID, Set<Edge>>(), // Map中的ID表示edge中的target,Set中的Edge表示所有指向该节点的边
    outEdgesMap: new Map<ID, Set<Edge>>(), // Map中的ID表示edge中的source,Set中的Edge表示所有从该节点出发的边
    viewWidth: 0, // 可视化窗口大小
    viewHeight: 0, // 可视化窗口大小
    menuWidth: 240, // 菜单栏宽度
    editorWidth: 300, // 编辑框宽度
    cardWidth: 120, // 实际卡片宽度
    cardHeight: 80 // 实际卡片高度
  }),
  getters: {
    project: (state) => {
      return state.projectsMap.get(state.projectId);
    },
    projects: (state) => Array.from(state.projectsMap.values()),
    sortedProjects: (state) => {
      return Array.from(state.projectsMap.values()).sort((a, b) => a.index - b.index);
    },
    getNodesByProjectId: (state) => (id: ID) => {
      return Array.from(state.nodesMap.values()).filter((node) => node.projectId === id);
    },
    getProjectById: (state) => (id: ID) => {
      return state.projectsMap.get(id);
    } /**
     * 根据项目id获取待绘制卡片信息
     * @param state
     */,
    currentCards: (state) => {
      const project = state.projectsMap.get(state.projectId);
      const bounds = {
        x: -project.x / state.cardWidth,
        y: -project.y / state.cardHeight,
        w: state.viewWidth / state.cardWidth,
        h: state.viewHeight / state.cardHeight
      }; // 计算当前视图的边界
      return Array.from(state.nodesMap.values())
        .filter((node) => node.projectId === state.projectId && cross(bounds, node))
        .sort((a, b) => a.x - b.x)
        .map((node) => ({
          id: node.id,
          name: node.name,
          x: node.x * state.cardWidth + 10, // 实际x点
          y: node.y * state.cardHeight + 10, // 实际y点
          w: node.w * state.cardWidth - 10 * 2, // 实际宽度
          h: node.h * state.cardHeight - 10 * 2, // 实际高度
          color: node.status ? '#dddddd' : '#fff' // 根据状态设置颜色
        }));
    } /**
     * 根据项目id获取所有边绘制信息
     * @param state
     */,
    currentPaths: (state) => {
      return Array.from(state.edgesMap.values())
        .filter((edge) => edge.projectId === state.projectId)
        .map((edge) => {
          const sourceNode = state.nodesMap.get(edge.source);
          const targetNode = state.nodesMap.get(edge.target);
          const startX = (sourceNode.x + sourceNode.w) * state.cardWidth - 10;
          const startY = (sourceNode.y + sourceNode.h / 2) * state.cardHeight;
          const targetX = targetNode.x * state.cardWidth + 10;
          const targetY = (targetNode.y + targetNode.h / 2) * state.cardHeight;
          const dist = targetX - startX;
          const controller1X = startX + dist / 2;
          const controller1Y = startY;
          const controller2X = targetX - dist / 2;
          const controller2Y = targetY;
          return {
            id: edge.id,
            startX,
            startY,
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
    addProject(project: Project) {
      this.projectsMap.set(project.id, project);
    },
    removeProject(item: ID | Project) {
      const id = typeof item === 'object' ? item.id : item;
      this.projectsMap.delete(id);
      // todo 删除所有关联的节点和边
    },
    addNode(node: Node) {
      this.nodesMap.set(node.id, node);
    },
    addEdge(node1: Node, node2: Node) {
      if (node1.projectId != node2.projectId) return;
      const edge: Edge = {
        source: node1.id,
        target: node2.id,
        id: v4(),
        projectId: node1.projectId
      };
      this.edgesMap.set(edge.id, edge);
      // todo 添加出边和入边
    },
    setProjectId(id: ID) {
      this.projectId = id;
    }
  }
});
