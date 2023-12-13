import {defineStore} from 'pinia'
import {PProject} from "@renderer/model";
import {delayLayout} from "@renderer/util/data";

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
      const project = new PProject()
      project.name = name
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
    },
    /**
     * 根据时间排更新项目和任务状态
     * @param time
     */
    update(time: number) {
      [...this.projects.values()].forEach(p => {
        delayLayout({index: time, nodes: p.data.nodes, edges: p.data.edges})
      })
      console.log(this.projects)
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
