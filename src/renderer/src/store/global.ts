import { defineStore } from 'pinia'
import { type Point } from '@antv/g-base'
import { v4 as uuidv4 } from 'uuid'
import type { EdgeConfig, GraphData, INode, NodeConfig } from '@antv/g6-core'
import type { IEdge } from '@antv/g6'

export interface IProject {
  name: string
  id: string
  tasks: ITask[]
  createdTime: Date
  offset: Point
}

export interface ITask {
  name: string
  id: string
  dataIndex: number
  y: number
  children: string[]
  parents: string[]
  createdTime: Date
  completedTime: Date | undefined
  state: 'completed' | 'timeout' | 'discard' | 'normal'
  target: string // 任务目标
  detail: string // 任务详情
  note: string // 笔记
}

export const useGlobalStore = defineStore('global', {
  state: () => ({
    active: '',
    projects: [] as IProject[]
  }),
  getters: {
    dataByDay(day = 0) {
      const ans: string[] = []
      for (const key in this.projects) {
        const res = this.projects[key].tasks
          .filter((n: ITask) => n.dataIndex === day)
          .map((v: ITask) => v.name)
        ans.push(...res)
      }
      return ans
    },
    graphData(): GraphData {
      const project = this.projects[this.active]
      if (project === undefined) {
        return {
          nodes: [],
          edges: []
        }
      }
      const tasks = project.tasks
      const edges: EdgeConfig[] = []
      for (const i in tasks) {
        const node = tasks[i]
        const children = node.children
        for (const j in children) {
          const edge = {
            source: node.id,
            target: children[j]
          }
          edges.push(edge)
        }
      }
      return {
        nodes: tasks.map((v: ITask) => {
          return {
            ...v,
            ...{
              // id: v.id,
              // name: v.name,
              x: v.dataIndex * 120 + 60,
              y: v.y,
              state: v?.state ?? 'completed'
            }
          } as unknown as NodeConfig
        }),
        edges
      }
    },
    currentProjectOffset(): Point {
      return this.projects[this.active]?.offset ?? { x: 0, y: 0 }
    },
    currentProject(): IProject | null {
      return this.projects[this.active] ?? null
    },
    currentProjectTasks(): ITask[] {
      return this.projects[this.active]?.tasks
    }
  },
  actions: {
    setActive(id: string) {
      this.active = id
    },
    createProjectByName(name: string) {
      const project: IProject = {
        name,
        id: uuidv4(),
        tasks: [],
        createdTime: new Date(),
        offset: { x: 0, y: 0 }
      }
      this.projects[project.id] = project
      return project
    },
    setCurrentProjectOffset(point: Point | undefined) {
      const offset = this.projects[this.active]?.offset ?? { x: 0, y: 0 }
      if (point) {
        offset.x = point.x
        offset.y = point.y
      }
    },
    updateCurrentProjectTask(task: ITask) {
      const currentTask = this.currentProject?.tasks.find((t: ITask) => t.id === task.id)
      if (currentTask) {
        const tmp = { ...currentTask, ...task }
        currentTask.name = tmp.name
        currentTask.y = tmp.y
        currentTask.dataIndex = tmp.dataIndex
        currentTask.id = tmp.id
        currentTask.children = tmp.children
      }
    },
    deleteCurrentProjectTaskById(id: string) {
      const projects = this.currentProject
      const tasks = projects?.tasks ?? []
      const index = tasks.findIndex((t: ITask) => t.id === id)
      const currentTask = tasks?.[index]

      // delete id from parents
      const parentsId = currentTask?.parents ?? []
      console.log('parent ids', parentsId)
      tasks
        .filter((task: ITask) => parentsId.includes(task.id))
        .forEach((task: ITask) => {
          task.children.splice(task.children.indexOf(id), 1)
        })

      // delete id from children
      const childrenIds = currentTask?.children
      tasks
        .filter((task: ITask) => childrenIds?.includes(task.id))
        .forEach((task: ITask) => {
          const parents = task.parents ?? []
          parents.splice(parents.indexOf(id), 1)
        })
      // delete current task
      this.currentProject?.tasks.splice(index, 1)
    },
    currentProjectAddEdge(edge: IEdge) {
      const source = edge.getSource() as INode
      const target = edge.getTarget() as INode
      const sourceId = source.getID()
      const targetId = target.getID()
      this.currentProject?.tasks
        .find((task: ITask) => task.id === sourceId)
        ?.children.push(targetId)
      this.currentProject?.tasks
        .find((task: ITask) => task.id === targetId)
        ?.parents?.push(sourceId)
    },
    currentProjectDeleteEdge(sourceId: string, targetId: string) {
      const children = this.currentProject?.tasks.find((t: ITask) => t.id == sourceId)?.children
      children?.splice(children?.indexOf(targetId), 1)

      const parents = this.currentProject?.tasks.find((t: ITask) => t.id === targetId)?.parents
      parents?.splice(parents?.indexOf(sourceId), 1)
    }
  },
  persist: true
})
