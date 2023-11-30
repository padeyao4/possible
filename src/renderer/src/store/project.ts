import {defineStore} from 'pinia'
import {Possible} from "@renderer/model";
import IProject = Possible.IProject;
import Project = Possible.Project;


type State = {
  projects: IProject[]
}

type Getters = {
  get: (state: any) => (id: string) => IProject,
  [key: string]: any
}

type Actions = {
  createByName: (name: string) => string
  delete: (id: string) => void
  push: (projects: IProject[] | undefined) => boolean
  merge: (projects: IProject[] | undefined) => void
}

export const useProjectStore = defineStore<string, State, Getters, Actions>('project', {
  state(): State {
    return {
      projects: []
    }
  },
  getters: {
    get: (state) => {
      return (id: string) => {
        return state.projects.find((value: IProject) => value.id === id) ?? {} as IProject
      }
    }
  },
  actions: {
    createByName(name: string): string {
      const project = new Project(name)
      this.projects.push(project)
      return project.id
    },
    delete(id: string) {
      this.projects = this.projects.filter((p) => p.id !== id)
    },

    /**
     * 当不存在项目id时，添加项目
     * @param projects
     */
    push(projects: IProject[] | undefined): boolean {
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
    },
    /**
     * 合并数据，会覆盖已存在数据
     * @param projects
     */
    merge(projects: IProject[] | undefined) {
      if (projects === undefined) return
      projects.forEach(project => {
        const exits = this.projects.find(p => p.id === project.id)
        if (exits) {
          const projects = this.projects.filter((p) => p.id !== project.id)
          this.$patch({projects})
        }
        this.projects.push(project)
      })
    }
  },
  persist: true
})
