import {Point} from '@antv/g-base'
import {EdgeConfig, NodeConfig} from "@antv/g6-core";

export interface IProject {
  name: string
  id: string
  createdTime: Date
  offset: Point,
  data: any // {nodes:[],edges:[],}
  initDate: Date
  completedDate: Date
  completed: boolean
  nodeWidth: number
  nodeHeight: number
  nodeMargin: number[]
}

export interface INode extends NodeConfig {
  name: string
  id: string
  y: number
  x: number,
  createdTime: Date
  updatedTime: Date
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
  orderIndex: number
  width: number,
  height: number,
  margin: number[] // 数组长度为4,上右下左
}

export interface IEdge extends EdgeConfig {
  id: string
  source: string // task id
  target: string // task id
}
