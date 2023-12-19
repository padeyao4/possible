import {defineStore} from 'pinia'
import {PProject} from "@renderer/model";
import {originIndex} from "@renderer/util/time";
import {dataUpdate} from "@renderer/util/data";
import {PossibleData} from "@renderer/types";

export const useStore = defineStore('project', {
  state() {
    return {
      projects: new Map<string, PProject>(),
      dn: originIndex(new Date()), // 现在时间1970年的天数
      experiment: false, // 是否开启实验功能
      autoUpdateDate: true // 时间自动更新
    }
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
    merge({data: {projects, experiment, dn, autoUpdateDate}}: PossibleData) {
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
        dataUpdate(this.dn - p.origin, p.data.nodes, p.data.edges)
      })
    }
  }
  // persist: true
})
