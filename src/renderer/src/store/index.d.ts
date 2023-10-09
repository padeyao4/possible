import { Point } from '@antv/g-base'

export interface IProject {
  name: string
  id: string
  tasks: ITask[]
  relations: IRelation[]
  createdTime: Date
  offset: Point
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
}

export interface IRelation {
  id: string
  source: string // task id
  target: string // task id
}
