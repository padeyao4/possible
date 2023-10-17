import { Point } from '@antv/g-base'

export interface IProject {
  name: string
  id: string
  tasks: ITask[]
  relations: IRelation[]
  createdTime: Date
  offset: Point
  /**
   * 初始时间
   */
  initDate: Date
}

export interface ITask {
  name: string
  id: string
  dataIndex: number
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
  taskType: 'period' | 'schedule' | 'general'
}

export interface IRelation {
  id: string
  source: string // task id
  target: string // task id
}
