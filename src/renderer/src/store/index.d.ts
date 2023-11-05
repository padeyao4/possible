import {Point} from '@antv/g-base'

export interface IPosData {
  nodes: IPosNode[],
  edges: IPosEdge[]
}

export interface IProject {
  name: string
  id: string
  createdTime: Date
  offset: Point,
  data: IPosData
  /**
   * 初始时间
   */
  initDate: Date
}

export interface IPosNode {
  name: string
  id: string
  y: number
  x: number
  createdTime: Date
  completedTime: Date | undefined
  state: 'completed' | 'timeout' | 'discard' | 'normal'
  target: string // 任务目标
  detail: string // 任务详情
  note: string // 笔记
  /**
   * 任务类型，周期任务，定时任务，一般任务
   */
  taskType: 'period' | 'schedule' | 'general',
  /**
   * 用于排序
   */
  orderIndex?: number
}

export interface IPosEdge {
  id: string
  source: string // task id
  target: string // task id
}
