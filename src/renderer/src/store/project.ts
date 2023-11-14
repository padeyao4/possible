import {defineStore} from 'pinia'
import {IProject} from '@renderer/model'
import {Possible} from "@renderer/model/project";
import Project = Possible.Project;

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
    },
    get: (state) => {
      return (id: string) => state.projects.find((value) => value.id === id) ?? {} as IProject
    }
  },
  actions: {
    createByName(name: string): string {
      const project = new Project(name)
      this.projects.push(project)
      return project.id
    },
    update(id: string, cfg: object) {
      const p = this.projects.find((project) => project.id === id) ?? ({} as IProject)
      const projects = this.projects.filter((project) => project.id !== id)
      this.$patch({projects: [...projects, {...p, ...cfg}]})
    },
    delete(id: string) {
      const projects = this.projects.filter((p) => p.id !== id)
      this.$patch({projects})
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
