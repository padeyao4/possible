import { v4 } from 'uuid'
import { originIndex } from '@renderer/util/time'
import {
  Expose,
  instanceToPlain,
  plainToInstance,
  Transform,
  TransformFnParams,
  Type
} from 'class-transformer'

export class PEdge {
  @Expose()
  id = ''
  @Expose()
  source = '' // task id
  @Expose()
  target = '' // task id

  toGraphEdge() {
    return instanceToPlain(this)
  }
}

export class PProject {
  @Expose()
  name = ''
  @Expose()
  completed = false
  @Expose()
  @Type(() => Date)
  completedTime: Date = new Date()
  @Expose()
  @Type(() => Date)
  createdTime: Date = new Date()
  @Expose()
  @Transform(PProject.transformNode, { toClassOnly: true })
  nodes: Map<string, PNode> = new Map<string, PNode>()
  @Expose()
  @Transform(PProject.transformEdge, { toClassOnly: true })
  edges: Map<string, PEdge> = new Map<string, PEdge>()
  @Expose()
  id: string = v4()
  @Expose()
  origin: number = originIndex(new Date()) // 距离1970的天数
  @Expose()
  offset: { x: number; y: number } = { x: 0, y: 0 } // 用于graph定位
  @Expose()
  nodeHeight = 40
  @Expose()
  nodeMargin: number[] = [40, 10, 40, 10]
  @Expose()
  nodeWidth = 100
  @Expose()
  renaming = false
  @Expose()
  order = 9999999 // 用于项目排序

  static transformNode(value: TransformFnParams) {
    const m = new Map<string, PNode>()
    for (const entry of Object.entries(value.value)) {
      m.set(entry[0], plainToInstance(PNode, entry[1]))
    }
    return m
  }

  static transformEdge(value: TransformFnParams) {
    const m = new Map<string, PEdge>()
    for (const entry of Object.entries(value.value)) {
      m.set(entry[0], plainToInstance(PEdge, entry[1]))
    }
    return m
  }

  toGraphData() {
    const nodes = [...this.nodes.values()].map((node) => node.toGraphNode())
    const edges = [...this.edges.values()].map((edge) => edge.toGraphEdge())
    return {
      nodes,
      edges
    }
  }
}

export class PNode {
  @Expose()
  name = ''
  @Expose()
  @Type(() => Date)
  createdTime: Date = new Date()
  @Expose()
  detail = ''
  @Expose()
  id: string = v4()
  @Expose()
  note = ''
  @Expose()
  order = 0 // 用于排序
  @Expose()
  state: 'completed' | 'timeout' | 'discard' | 'normal' = 'normal'
  @Expose()
  target = ''
  @Expose()
  taskType: 'period' | 'schedule' | 'general' = 'general'
  @Expose()
  @Type(() => Date)
  updatedTime: Date = new Date()
  @Expose()
  x = 0 // 只用于graph显示,修改无效
  @Expose()
  y = 0 // 只用于graph显示,修改无效
  @Expose()
  height = 40
  @Expose()
  width = 100
  @Expose()
  margin: number[] = [40, 10, 40, 10] // 上右下左
  @Expose()
  projectId = ''
  @Expose()
  dn = 0 // 时间按天的序列号

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

  toGraphNode() {
    return {
      id: this.id,
      data: instanceToPlain(this)
    }
  }
}

export class Store {
  @Expose()
  @Transform(Store.transformProjects, { toClassOnly: true })
  projects: Map<string, PProject> = new Map<string, PProject>()
  @Expose()
  dn: number = originIndex(new Date()) // 现在时间1970年的天数
  @Expose()
  experiment = false // 是否开启实验功能
  @Expose()
  autoUpdateDate = true // 时间自动更新
  @Expose()
  dev: boolean | string = true // 当前系统环境

  static transformProjects(value: TransformFnParams) {
    const m = new Map<string, PProject>()
    for (const entry of Object.entries(value.value)) {
      m.set(entry[0], plainToInstance(PProject, entry[1]))
    }
    return m
  }
}
