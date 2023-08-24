import {defineStore} from "pinia";
import {type Point} from "@antv/g-base";
import {v4 as uuidv4} from 'uuid'
import type {GraphData} from "@antv/g6-core";

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
    children: string[]
}


interface GlobalState {
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
            setCurrentProjectOffset(x: number, y: number) {
                let p = this.projects[this.active].offset
                p.x = x;
                p.y = y;
            }
        },
    }
)

