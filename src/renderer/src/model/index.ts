import {v4} from "uuid";
import {originIndex} from "@renderer/util/time";
import {plainToInstance, Transform, TransformFnParams, Type} from "class-transformer";

export class PEdge {
  id: string = ''
  source: string = '' // task id
  target: string = '' // task id
}

export class PProject {
  name: string = '';
  completed: boolean = false;
  @Type(() => Date)
  completedTime: Date = new Date();
  @Type(() => Date)
  createdTime: Date = new Date();
  @Transform(PProject.transformNode, {toClassOnly: true})
  nodes: Map<string, PNode> = new Map<string, PNode>();
  @Transform(PProject.transformEdge, {toClassOnly: true})
  edges: Map<string, PEdge> = new Map<string, PEdge>();
  id: string = v4();
  origin: number = originIndex(new Date()); // 距离1970的天数
  offset: { x: number, y: number } = {x: 0, y: 0}; // 用于graph定位
  nodeHeight: number = 40;
  nodeMargin: number[] = [40, 10, 40, 10];
  nodeWidth: number = 100;
  renaming: boolean = false
  order: number = 9999999 // 用于项目排序

  static transformNode(value: TransformFnParams) {
    let m = new Map<string, PNode>()
    for (let entry of Object.entries(value.value)) {
      m.set(entry[0], plainToInstance(PNode, entry[1]))
    }
    return m
  }

  static transformEdge(value: TransformFnParams) {
    let m = new Map<string, PEdge>()
    for (let entry of Object.entries(value.value)) {
      m.set(entry[0], plainToInstance(PEdge, entry[1]))
    }
    return m
  }
}

export class PNode {
  name: string = '';
  @Type(() => Date)
  createdTime: Date = new Date();
  detail: string = '';
  id: string = v4();
  note: string = '';
  order: number = 0; // 用于排序
  state: "completed" | "timeout" | "discard" | "normal" = 'normal';
  target: string = '';
  taskType: "period" | "schedule" | "general" = 'general';
  @Type(() => Date)
  updatedTime: Date = new Date();
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

  x2dn() {
    const half = Math.floor(this.cellWidth / 2)
    this.dn = Math.floor((this.x - half) / this.cellWidth)
    return this
  }

  dn2x() {
    const half = Math.floor(this.cellWidth / 2)
    this.x = this.dn * this.cellWidth + half
    return this
  }

  normalXY(x: number, y: number) {
    this.x = Math.floor(x / this.cellWidth) * this.cellWidth + Math.floor(this.cellWidth / 2)
    this.y = y
    return this
  }
}

export class Store {
  @Transform(Store.transformProjects, {toClassOnly: true})
  projects: Map<string, PProject> = new Map<string, PProject>()
  dn: number = originIndex(new Date()) // 现在时间1970年的天数
  experiment: boolean = false // 是否开启实验功能
  autoUpdateDate: boolean = true // 时间自动更新
  dev: boolean | string = true // 当前系统环境

  static transformProjects(value: TransformFnParams) {
    let m = new Map<string, PProject>()
    for (let entry of Object.entries(value.value)) {
      m.set(entry[0], plainToInstance(PProject, entry[1]))
    }
    return m
  }
}
