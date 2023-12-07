import {defineStore} from 'pinia'
import {Possible} from "@renderer/model";
import IProject = Possible.IProject;
import Project = Possible.Project;

export const useStore = defineStore('project', {
  state() {
    return {
      projects: new Map<string, IProject>()
    }
  },
  getters: {
    list: (state) => {
      return [...state.projects.values()].sort((p1, p2) => p1.order - p2.order)
    }
  },
  actions: {
    createByName(name: string): string {
      const project = new Project(name)
      this.projects.set(project.id, project)
      return project.id
    },
    delete(id: string) {
      this.projects.delete(id)
    },
    set(project: IProject) {
      this.projects.set(project.id, project)
    },

    /**
     * 合并数据，会覆盖已存在数据
     * @param projects
     */
    merge(projects: IProject[] | undefined) {
      projects?.forEach(p => {
        this.projects.set(p.id, p)
      })
    }
  },
  // persist: true
})
