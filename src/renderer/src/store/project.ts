import {defineStore} from 'pinia'
import {PProject} from "@renderer/model";

export const useStore = defineStore('project', {
  state() {
    return {
      projects: new Map<string, PProject>()
    }
  },
  getters: {
    list: (state) => {
      return [...state.projects.values()].sort((p1, p2) => p1.order - p2.order)
    }
  },
  actions: {
    createByName(name: string): string {
      const project = new PProject(name)
      this.projects.set(project.id, project)
      return project.id
    },
    delete(id: string) {
      this.projects.delete(id)
    },
    set(project: PProject) {
      this.projects.set(project.id, project)
    },

    /**
     * 合并数据，会覆盖已存在数据
     * @param projects
     */
    merge(projects: PProject[] | undefined) {
      projects?.forEach(p => {
        this.projects.set(p.id, p)
      })
    }
  }
  // persist: true
})

export const useSettings = defineStore('settings', {
  state() {
    return {
      /**
       * 是否开启实验功能
       */
      experiment: false,
      /**
       * 开启自动更新时间
       */
      autoUpdateDate: true
    }
  }
})
