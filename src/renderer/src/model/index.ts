import {v4} from "uuid";
import {originIndex} from "@renderer/util/time";

export class PEdge {
  id: string = ''
  source: string = '' // task id
  target: string = '' // task id
}

export class PProject {
  name: string = '';
  completed: boolean = false;
  completedTime: number = new Date().getTime();
  createdTime: number = new Date().getTime();
  data: { nodes: PNode[], edges: PEdge[] } = {nodes: [], edges: []};
  id: string = v4();
  origin: number = originIndex(new Date()); // 距离1970的天数
  offset: { x: number, y: number } = {x: 0, y: 0}; // 用于graph定位
  nodeHeight: number = 40;
  nodeMargin: number[] = [40, 10, 40, 10];
  nodeWidth: number = 100;
  renaming: boolean = false
  order: number = 9999999 // 用于项目排序
}

export class PNode {
  name: string = '';
  createdTime: number = new Date().getTime();
  detail: string = '';
  id: string = v4();
  note: string = '';
  order: number = 0; // 用于排序
  state: "completed" | "timeout" | "discard" | "normal" = 'normal';
  target: string = '';
  taskType: "period" | "schedule" | "general" = 'general';
  updatedTime: number = new Date().getTime();
  x: number = 0; // 只用于graph显示,修改无效
  y: number = 0; // 只用于graph显示,修改无效
  height: number = 40;
  width: number = 100;
  margin: number[] = [40, 10, 40, 10]; // 上右下左
  projectId: string = '';
  dn: number = 0 // 时间按天的序列号


  get cellWidth() {
    return this.width + this.margin[1] + this.margin[3]
  }

  get cellHeight() {
    return this.height + this.margin[0] + this.margin[2]
  }

  static from(node: Partial<PNode>) {
    return Object.assign(new PNode(), node)
  }

  normalXY(x: number, y: number) {
    this.x = Math.floor(x / this.cellWidth) * this.cellWidth + Math.floor(this.cellWidth / 2)
    this.y = y
  }
}
