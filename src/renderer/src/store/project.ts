import {defineStore} from 'pinia'
import {IProject} from '@renderer/store/index'
import {v4 as uuidv4} from 'uuid'

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
                .map((project: IProject) => ({name: project.name, id: project.id}))
        },
        get: (state) => {
            return (id: string) => state.projects.find((value) => value.id === id) ?? {} as IProject
        }
    },
    actions: {
        createByName(name: string): string {
            const id = uuidv4()
            this.projects.push({
                name,
                id,
                createdTime: new Date(),
                initDate: new Date(),
                data: {nodes: [], edges: []},
                offset: {
                    x: 0,
                    y: 0
                }
            })
            return id
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
                    this.delete(project.id)
                }
                this.projects.push(project)
            })
        },

        toData() {
            return {
                data: this.projects,
                time: new Date().getTime(),
                version: 'v1-alpha'
            }
        }
    },
    persist: true
})
