import { defineStore } from 'pinia'
import { IProject, IRelation, ITask } from '@renderer/store/index'
import { v4 as uuidv4 } from 'uuid'
import { EdgeConfig, NodeConfig } from '@antv/g6-core'

export const useProjectStore = defineStore('project', {
  state(): {
    projects: IProject[]
  } {
    return {
      projects: [] as IProject[]
    }
  },
  getters: {
    list: (state) => {
      return state.projects
        .sort(
          (project1, project2) =>
            new Date(project1.createdTime).getTime() - new Date(project2.createdTime).getTime()
        )
        .map((project: IProject) => ({ name: project.name, id: project.id }))
    },
    get: (state) => {
      return (id: string) => state.projects.find((value) => value.id === id) ?? ({} as IProject)
    },
    data: (state) => {
      return (id: string) => {
        const project = state.projects.find((p) => p.id === id)
        return {
          nodes: (project?.tasks as unknown as NodeConfig[]) ?? [],
          edges: (project?.relations as unknown as EdgeConfig[]) ?? []
        }
      }
    }
  },
  actions: {
    createByName(name: string): string {
      const projectId = uuidv4()
      this.projects.push({
        name,
        id: projectId,
        tasks: [],
        relations: [],
        createdTime: new Date(),
        initDate: new Date('2023/9/1'),
        offset: {
          x: -Math.floor((new Date().valueOf() - new Date('2023/9/1').valueOf()) / 86400000) * 120,
          y: 0
        }
      })
      return projectId
    },
    update(id: string, cfg: object) {
      const p = this.projects.find((project) => project.id === id) ?? ({} as IProject)
      const projects = this.projects.filter((project) => project.id !== id)
      this.$patch({ projects: [...projects, { ...p, ...cfg }] })
    },
    delete(id: string) {
      const projects = this.projects.filter((p) => p.id !== id)
      this.$patch({ projects })
    },
    addTask(id: string, task: ITask) {
      this.projects.find((p) => p.id === id)?.tasks.push(task)
    },
    addRelation(id: string, relation: IRelation) {
      this.projects.find((p) => p.id === id)?.relations.push(relation)
    },
    deleteTask(id: string, taskId: string) {
      const project = this.projects.find((p) => p.id === id)
      const tasks = project?.tasks
      const index = tasks?.findIndex((t) => t.id === taskId)
      if (index !== undefined) {
        project?.tasks?.splice(index, 1)
      }
    },
    deleteRelation(id: string, relationId: string) {
      const project = this.projects.find((p) => p.id === id)
      const relations = project?.relations
      const index = relations?.findIndex((r) => r.id === relationId)
      if (index !== undefined) {
        project?.relations?.splice(index, 1)
      }
    },
    updateTask(id: string, task: ITask) {
      Object.assign(
        this.projects.find((p) => p.id === id)?.tasks.find((t) => t.id === task.id) ?? {},
        task
      )
    },
    updateRelation(id: string, relation: IRelation) {
      Object.assign(
        this.projects.find((p) => p.id === id)?.relations.find((r) => r.id === relation.id) ?? {},
        relation
      )
    },

    /**
     * 当不存在项目id时，添加项目
     * @param projects
     */
    push(projects: IProject[] | undefined) {
      if (projects === undefined) {
        return false
      }
      let e = false
      projects.forEach((o) => {
        const exist = this.projects.find((p) => p.id === o.id)
        if (!exist) {
          this.projects.push(o)
        } else {
          e = true
          return
        }
      })
      return !e
    }
  },
  persist: true
})
