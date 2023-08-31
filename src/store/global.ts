import {defineStore} from "pinia";
import {type Point} from "@antv/g-base";
import {v4 as uuidv4} from 'uuid'
import type {GraphData, INode} from "@antv/g6-core";
import type {IEdge} from "@antv/g6";

export interface IProject {
    name: string
    id: string
    tasks: ITask[]
    createdTime: Date,
    offset: Point
}

export interface ITask {
    name: string
    id: string
    dataIndex: number
    y: number
    children: string[],
    parents: string[]
}

interface GlobalState {
    /**
     * 当前激活的项目id
     */
    active: string
    projects: Record<string, IProject>
}

export const useGlobalStore = defineStore('global', {
        state: (): GlobalState => ({
            active: '',
            projects: {}
        }),
        getters: {
            dataByDay(day: number = 0) {
                let ans: string[] = []
                for (let key in this.projects) {
                    let res = this.projects[key].tasks.filter((n: ITask) => n.dataIndex === day).map(v => v.name)
                    ans.push(...res)
                }
                return ans
            },
            graphData(): GraphData {
                let project = this.projects[this.active]
                console.log('project', project)
                if (project === undefined) {
                    return {
                        nodes: [],
                        edges: []
                    }
                }
                let tasks = project.tasks
                let edges = []
                for (let i in tasks) {
                    let node = tasks[i]
                    let children = node.children
                    for (let j in children) {
                        let edge = {
                            source: node.id,
                            target: children[j]
                        }
                        edges.push(edge)
                    }
                }
                return {
                    nodes: tasks.map((v) => {
                        return {
                            id: v.id,
                            label: v.name,
                            x: v.dataIndex * 120 + 60,
                            y: v.y
                        }
                    }),
                    edges
                }
            },
            currentProjectOffset(): Point {
                return this.projects[this.active]?.offset ?? {x: 0, y: 0}
            },
            currentProject(): IProject {
                return this.projects[this.active]
            },
            currentProjectTasks(): ITask[] {
                return this.projects[this.active]?.tasks
            }
        },
        actions: {
            createProjectByName(name: string) {
                let project: IProject = {
                    name,
                    id: uuidv4(),
                    tasks: [],
                    createdTime: new Date(),
                    offset: {x: 0, y: 0}
                }
                this.projects[project.id] = project
                return project
            },
            setCurrentProjectOffset(point: Point | undefined) {
                let offset = this.projects[this.active].offset
                if (point) {
                    offset.x = point.x;
                    offset.y = point.y;
                }
            },
            currentProjectAddTask(task: ITask) {
                this.currentProject?.tasks.push(task)
            },
            setCurrentProjectTask(task: ITask) {
                let currentTask = this.currentProject?.tasks.find(t => t.id === task.id)
                if (currentTask) {
                    let tmp = {...currentTask, ...task}
                    currentTask.name = tmp.name
                    currentTask.y = tmp.y
                    currentTask.dataIndex = tmp.dataIndex
                    currentTask.id = tmp.id
                    currentTask.children = tmp.children
                }
            },
            deleteCurrentProjectTaskById(id: string) {
                let self = this
                let projects = self.currentProject
                let tasks = projects?.tasks ?? []
                let index = tasks.findIndex(t => t.id === id)
                let currentTask = tasks?.[index];

                // delete id from parents
                let parentsId = currentTask?.parents ?? []
                console.log('parent ids', parentsId)
                tasks.filter(task => parentsId.includes(task.id)).forEach(task => {
                    task.children.splice(task.children.indexOf(id), 1)
                })

                // delete id from children
                let childrenIds = currentTask?.children
                tasks.filter(task => childrenIds?.includes(task.id)).forEach(task => {
                    let parents = task.parents ?? []
                    parents.splice(parents.indexOf(id), 1)
                })
                // delete current task
                self.currentProject?.tasks.splice(index, 1)
            },
            currentProjectAddEdge(edge: IEdge) {
                let source = edge.getSource() as INode
                let target = edge.getTarget() as INode
                let sourceId = source.getID()
                let targetId = target.getID()
                this.currentProject.tasks.find(task => task.id === sourceId)?.children.push(targetId)
                this.currentProject.tasks.find(task => task.id === targetId)?.parents?.push(sourceId)
            },
            currentProjectDeleteEdge(sourceId: string, targetId: string) {
                let children = this.currentProject.tasks.find(t => t.id == sourceId)?.children;
                children?.splice((children?.indexOf(targetId))!, 1)

                let parents = this.currentProject.tasks.find(t => t.id === targetId)?.parents
                parents?.splice(parents!.indexOf(sourceId), 1)
            }
        },
    }
)

