import { DataStoreControllerApi, type Edge, type Node, NodeTypeEnum, type Project } from '@/openapi';
import { defineStore } from 'pinia';
import { v4 } from 'uuid';
import type { Ref } from 'vue';

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

export interface TempEdge {
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
    projectId: '', // 当前项目id
    projectsMap: new Map<string, Project>(),
    tempEdge: null as TempEdge | null, // 临时边
    nodesMap: new Map<string, Node>(),
    edgesMap: new Map<string, Edge>(),
    inEdgesMap: new Map<string, Set<Edge>>(), // Map中的ID表示edge中的target,Set中的Edge表示所有指向该节点的边
    outEdgesMap: new Map<string, Set<Edge>>(), // Map中的ID表示edge中的source,Set中的Edge表示所有从该节点出发的边
    menuWidth: 260, // 菜单栏宽度
    menuVisible: true, // 菜单栏是否显示
    editorWidth: 0, // 编辑框宽度
    editorVisible: true, // 编辑框是否显示
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
      return Array.from(state.projectsMap.values()).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    },
    getNodesByProjectId: (state) => (id: string) => {
      return Array.from(state.nodesMap.values()).filter((node) => node.projectId === id);
    },
    getProjectById: (state) => (id: string) => {
      return state.projectsMap.get(id);
    },
    /**
     * 根据项目id获取待绘制卡片信息,所有当前项目下的卡片数据
     */
    currentCards(): CardDraw[] {
      const cards = Array.from(this.nodesMap.values())
        .filter((node) => node.projectId === this.projectId)
        .sort((a, b) => (a.x ?? 0) - (b.x ?? 0))
        .map((node) => {
          const x = (node.x ?? 0) * this.cardWidth + 10;
          const y = (node.y ?? 0) * this.cardHeight + 10;
          const w = (node.w ?? 1) * this.cardWidth - 10 * 2;
          const h = node.h! * this.cardHeight - 10 * 2;
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
          nodesMap.get(key)!.push(card);
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

      return cards.map((card): CardDraw => {
        return {
          ...card,
          id: card.id!, // 确保id不为undefined
          name: card.name!, // 确保name不为undefined
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
     * 根据项目id获取所有边绘制信息
     */
    currentPaths(): PathDraw[] {
      const cardsMap = new Map<string, CardDraw>();
      this.currentCards.forEach((card) => cardsMap.set(card.id, card));

      const ans = [] as any[];

      if (this.tempEdge?.projectId === this.projectId) {
        const { x: sourceX, y: sourceY } =
          typeof this.tempEdge.source === 'string'
            ? cardsMap.get(this.tempEdge.source)!.anchor.source
            : this.tempEdge.source;
        const { x: targetX, y: targetY } =
          typeof this.tempEdge.target === 'string'
            ? cardsMap.get(this.tempEdge.target)!.anchor.target
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
          const { x: sourceX, y: sourceY } = cardsMap.get(edge.source!)!.anchor.source;
          const { x: targetX, y: targetY } = cardsMap.get(edge.target!)!.anchor.target;
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
      const menuStyle = state.menuVisible ? `${state.menuWidth}px` : '';
      const editorStyle = state.editorVisible ? `${state.editorWidth}px` : '';
      return { gridTemplateColumns: `${menuStyle} 1fr ${editorStyle}` };
    },
    /**
     * 根据项目id和节点id利用bfs获取所有子节点
     */
    getChildrenNodes: (state) => (item: Node | string) => {
      const node = typeof item === 'string' ? state.nodesMap.get(item)! : item;
      const ans = [] as Node[];
      const queue = [node.id];
      const visited = new Set<string>();
      while (queue.length > 0) {
        const nodeId = queue.shift()!;
        if (visited.has(nodeId)) continue;
        visited.add(nodeId);
        ans.push(state.nodesMap.get(nodeId)!);
        const outEdges = state.outEdgesMap.get(nodeId);
        const inEdges = state.inEdgesMap.get(nodeId);
        const edges = [...(outEdges || []), ...(inEdges || [])];
        if (edges) {
          for (const edge of edges) {
            if (edge.projectId === node.projectId) {
              queue.push(edge.target!);
              queue.push(edge.source!);
            }
          }
        }
      }
      return ans;
    },
    /**
     * 根据项目id和节点id利用bfs获取所有出边节点
     */
    getOutChildrenNodes: (state) => (item: Node | string) => {
      const node = typeof item === 'string' ? state.nodesMap.get(item)! : item;
      const ans = [] as Node[];
      const queue = [node.id];
      const visited = new Set<string>();
      while (queue.length > 0) {
        const nodeId = queue.shift()!;
        if (visited.has(nodeId)) continue;
        visited.add(nodeId);
        ans.push(state.nodesMap.get(nodeId)!);
        const edges = state.outEdgesMap.get(nodeId);
        if (edges) {
          for (const edge of edges) {
            if (edge.projectId === node.projectId) {
              queue.push(edge.target!);
            }
          }
        }
      }
      return ans;
    },
    /**
     * 根据当前时间戳获取画布index坐标
     * @param state
     */
    currentIndex: (state) => {
      return days(state.timestamp);
    }
  },
  actions: {
    addProject(project: Project) {
      this.projectsMap.set(project.id!, project);
    },
    /**
     * 按时间更新项目节点
     */
    updateNodes() {
      const visited = new Set<string>();
      Array.from(this.nodesMap.values())
        .sort((a, b) => a.x! - b.x!)
        .filter((node) => !visited.has(node.id!))
        .filter(({ type }) => !type || type === NodeTypeEnum.Normal)
        .filter((node) => !node.status)
        .filter((node) => node.x! + node.w! <= this.currentIndex)
        .forEach((node) => {
          if (visited.has(node.id!)) return;
          visited.add(node.id!);
          const dx = this.currentIndex - (node.x! + node.w! - 1);
          node.w! += dx;
          // 递归找到node所有右侧节点，更新x,更新规则为w=w+dx
          this.getOutChildrenNodes(node).forEach((child) => {
            if (!visited.has(child.id!)) {
              child.x! += dx;
              visited.add(child.id!);
            }
          });
        });
    },
    removeProject(item: string | Project) {
      const id = typeof item === 'object' ? item.id : item;
      this.nodesMap.forEach((value, key) => {
        value.projectId === id && this.removeNode(key);
      });
      this.projectsMap.delete(id!);
    },
    addNode(node: Node) {
      this.nodesMap.set(node.id!, node);
    },
    removeNode(item: string | Node) {
      const id = typeof item === 'object' ? item.id : item;
      // 删除入边和出边,
      this.inEdgesMap.get(id!)?.forEach((edge) => {
        this.outEdgesMap.get(edge.source!)?.delete(edge);
      });
      this.outEdgesMap.get(id!)?.forEach((edge) => {
        this.inEdgesMap.get(edge.target!)?.delete(edge);
      });
      this.inEdgesMap.delete(id!);
      this.outEdgesMap.delete(id!);

      // 找到source或者target为id的边,删除
      this.edgesMap.forEach((value, key) => {
        (value.source === id || value.target === id) && this.edgesMap.delete(key);
      });
      // 删除节点
      this.nodesMap.delete(id!);
    },
    addEdge(edge: Edge) {
      this.edgesMap.set(edge.id!, edge);

      const { source, target } = edge;
      // 添加入边
      if (this.inEdgesMap.has(target!)) {
        this.inEdgesMap.get(target!)!.add(edge);
      } else {
        this.inEdgesMap.set(target!, new Set([edge]));
      }
      // 添加出边
      if (this.outEdgesMap.has(source!)) {
        this.outEdgesMap.get(source!)!.add(edge);
      } else {
        this.outEdgesMap.set(source!, new Set([edge]));
      }
    },
    removeEdge(item: string | Edge) {
      const id = typeof item === 'object' ? item.id : item;
      const edge = this.edgesMap.get(id!)!;
      const { source, target } = edge;
      // 删除入边
      this.inEdgesMap.get(target!)?.delete(edge);
      // 删除出边
      this.outEdgesMap.get(source!)?.delete(edge);
      // 删除边
      this.edgesMap.delete(id!);
    },
    setProjectId(id: string) {
      this.projectId = id;
    },
    /**
     * 根据改变当前项目坐标
     */
    setCurrentProjectPositionByDate(dateType: DateType) {
      const offsetX = -days(dateType) * this.cardWidth;
      this.project!.x = offsetX > 0 ? offsetX - 1 : offsetX;
      this.project!.y = 0;
    },
    /**
     * 剥离节点
     */
    stripNode(item: Node | string) {
      const node = typeof item === 'string' ? this.nodesMap.get(item)! : item;
      this.inEdgesMap.get(node.id!)?.forEach((edge) => {
        this.removeEdge(edge);
      });
      this.outEdgesMap.get(node.id!)?.forEach((edge) => {
        this.removeEdge(edge);
      });
    },
    /**
     * 追加节点,会是后续节点后移，并继承所有连线关系
     */
    appendNode(item: Node | string) {
      const node = typeof item === 'string' ? this.nodesMap.get(item)! : item;
      const visited = new Set<string>();
      this.outEdgesMap.get(node.id!)?.forEach((edge) => {
        const { target } = edge;
        const targetNode = this.nodesMap.get(target!)!;
        if (targetNode.x === node.x! + node.w!) {
          this.getOutChildrenNodes(targetNode)
            .filter((child) => !visited.has(child.id!))
            .forEach((child) => {
              child.x! += 1;
              visited.add(child.id!);
            });
        }
      });
      const newNodeId = v4();
      this.addNode({
        ...node,
        id: newNodeId,
        name: 'untitled',
        w: 1,
        h: 1,
        x: node.x! + node.w!,
        y: node.y!,
        status: false
      });
      // 处理边
      this.outEdgesMap.get(node.id!)?.forEach((edge) => {
        this.removeEdge(edge);
        this.addEdge({
          id: v4(),
          source: newNodeId,
          target: edge.target!,
          projectId: node.projectId!
        })
      });
      this.addEdge({
        id: v4(),
        source: node.id!,
        target: newNodeId,
        projectId: node.projectId!
      });
    },
    /**
     * 插入节点,会插入到指定位置，并继承所有连线关系
     */
    insertNode(item: Node | string) {
      const node = typeof item === 'string' ? this.nodesMap.get(item)! : item;
      const visited = new Set<string>();

      // 创建新节点
      const newNodeId = v4();
      this.addNode({
        ...node,
        id: newNodeId,
        name: 'untitled',
        w: 1,
        h: 1,
        x: node.x!,
        y: node.y!,
        status: false
      });

      // 将目标节点及其所有子节点向右移动一格
      this.getOutChildrenNodes(node)
        .filter((child) => !visited.has(child.id!))
        .forEach((child) => {
          child.x! += 1;
          visited.add(child.id!);
        });


      // 处理入边 - 将原来指向node的边指向新节点
      this.inEdgesMap.get(node.id!)?.forEach((edge) => {
        this.removeEdge(edge);
        this.addEdge({
          id: v4(),
          source: edge.source!,
          target: newNodeId,
          projectId: node.projectId!
        });
      });

      // 添加新节点到原节点的边
      this.addEdge({
        id: v4(),
        source: newNodeId,
        target: node.id!,
        projectId: node.projectId!
      });
    },
    /**
     * 获取项目数据
     */
    fetch() {
      this.loading = true;
      new DataStoreControllerApi()
        .list()
        .then((res) => {
          const { projects, edges, nodes } = res.data.payload!;
          this.nodesMap.clear();
          this.edgesMap.clear();
          this.projectsMap.clear();
          projects!.forEach((project) => this.projectsMap.set(project.id!, project));
          nodes!.forEach((node) => this.nodesMap.set(node.id!, node));
          edges!.forEach((edge) => this.addEdge(edge));
          this.updateNodes();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 上传项目数据
     */
    upload() {
      new DataStoreControllerApi().add({
        projects: Array.from(this.projectsMap.values()),
        nodes: Array.from(this.nodesMap.values()),
        edges: Array.from(this.edgesMap.values())
      });
    }
  }
});
