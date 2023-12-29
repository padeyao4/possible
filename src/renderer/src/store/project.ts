import {defineStore} from 'pinia'
import {PProject, Store} from "@renderer/model";
import {dataUpdate} from "@renderer/util/data";

export const useStore = defineStore('project', {
  state() {
    return {...new Store()}
  },
  getters: {
    list: (state) => {
      return [...state.projects.values()].sort((p1, p2) => p1.order - p2.order)
    }
  },
  actions: {
    delete(id: string) {
      this.projects.delete(id)
    },
    set(project: PProject) {
      this.projects.set(project.id, project)
    },

    /**
     * 合并数据，会覆盖已存在数据
     */
    merge({projects, experiment, dn, autoUpdateDate}: Store) {
      this.projects = projects
      this.experiment = experiment
      this.autoUpdateDate = autoUpdateDate
      this.dn = dn
    },
    /**
     * 根据时间排更新项目和任务状态
     */
    update() {
      [...this.projects.values()].forEach(p => {
        dataUpdate(this.dn - p.origin, p.nodes, p.edges)
      })
    }
  }
})
