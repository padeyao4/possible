import {Point} from "@antv/g-base";
import {v4} from "uuid";

export class PEdge {
  id: string
  source: string // task id
  target: string // task id

  constructor(id: string, source: string, target: string) {
    this.id = id;
    this.source = source;
    this.target = target;
  }
}

export class PProject {
  name: string;
  completed: boolean;
  completedTime: Date;
  createdTime: Date;
  data: {
    nodes: PNode[]
    edges: PEdge[]
  };
  id: string;
  baseTime: Date;
  offset: Point;
  nodeHeight: number;
  nodeMargin: number[];
  nodeWidth: number;
  renaming: boolean
  order: number

  constructor(name: string) {
    this.name = name;
    this.completed = false
    this.completedTime = new Date()
    this.createdTime = new Date()
    this.data = {nodes: [], edges: []}
    this.id = v4()
    this.baseTime = new Date()
    this.offset = {x: 0, y: 0}
    this.nodeHeight = 40
    this.nodeWidth = 100
    this.nodeMargin = [40, 10, 40, 10]
    this.order = 9999999
    this.renaming = false
  }

  get cellWidth() {
    return this.nodeWidth + this.nodeMargin[1] + this.nodeMargin[3]
  }
}

export class PNode {
  name: string;
  createdTime: Date;
  detail: string;
  id: string;
  note: string;
  orderIndex: number;
  state: "completed" | "timeout" | "discard" | "normal";
  target: string;
  taskType: "period" | "schedule" | "general";
  updatedTime: Date;
  x: number;
  y: number;
  height: number;
  width: number;
  margin: number[];
  projectId: string

  [key: string]: any

  constructor(name: string = '', projectId: string = '') {
    this.name = name;
    this.createdTime = new Date()
    this.detail = ''
    this.id = v4()
    this.note = ''
    this.orderIndex = 0
    this.state = 'normal'
    this.target = ''
    this.taskType = 'general'
    this.updatedTime = new Date()
    this.x = 0
    this.y = 0
    this.height = 40
    this.width = 100
    this.margin = [40, 10, 40, 10]
    this.projectId = projectId
  }

  get position() {
    return {x: this.x, y: this.y}
  }

  set position(p: { x: number, y: number }) {
    this.x = p.x
    this.y = p.y
  }

  get cellWidth() {
    return this.width + this.margin[1] + this.margin[3]
  }

  get cellHeight() {
    return this.height + this.margin[0] + this.margin[2]
  }

  get index() {
    return (this.x - Math.floor(this.cellWidth / 2)) / this.cellWidth
  }

  static from(node: Partial<PNode>) {
    return Object.assign(new PNode(), node)
  }

  normalXY(x: number, y: number) {
    this.x = Math.floor(x / this.cellWidth) * this.cellWidth + Math.floor(this.cellWidth / 2)
    this.y = y
  }
}
