import {reactive} from "vue";
import {v4 as uuidv4} from 'uuid'
import type {GraphData} from "@antv/g6-core/lib/types";
import templateJson from '@/data/template.json'

export interface ITask {
    name: string
    id: string
    dataIndex: number
    y: number
    children: string[]
}

export class Task implements ITask {
    name: string
    id: string
    dataIndex: number
    y: number
    children: string[]

    constructor(name: string, dataIndex: number, y: number, id: string = uuidv4(), children: string[] = []) {
        this.name = name;
        this.id = id;
        this.dataIndex = dataIndex;
        this.y = y;
        this.children = children;
    }
}

export interface IProject {
    name: string
    id: string
    tasks: ITask[]
    createdTime: Date
}

export class Project implements IProject {
    name: string
    id: string
    tasks: ITask[]
    createdTime: Date

    constructor(name: string, id: string = uuidv4(), tasks: Task[] = [], createdTime: Date = new Date()) {
        this.name = name;
        this.id = id;
        this.tasks = tasks;
        this.createdTime = createdTime;
    }

    addTask(task: ITask) {
        this.tasks.push(task)
    }

    removeTask(taskId: string) {
        let tasks = this.tasks.filter(t => t.id == taskId)
        this.tasks.unshift(...tasks)
    }
}

class Model {
    public active: string
    public projects: IProject[]

    public constructor(projects: IProject[] = [], active: string = '') {
        this.projects = projects
        this.active = active
    }

    public addProject(name: string) {
        let project: IProject = new Project(name)
        this.projects.push(project)
        return project
    }

    public addTask(projectId: string, taskName: string) {
        let projects = this.projects.filter((project: IProject) => project.id === projectId);
        if (projects.length === 1) {
            projects[0].tasks.push(new Task(taskName, 3, 300))
        }
    }

    /**
     * select data based on the project key and covert to data for antv g6
     */
    public dataByKey(id: string): GraphData {
        let projects = this.projects.filter(p => p.id === id)
        if (projects.length === 0) {
            return {
                nodes: [],
                edges: []
            }
        }
        let project = projects[0]
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
    }

    public dataByDay(day: number = 0) {
        let ans: string[] = []
        for (let project of this.projects) {
            let res = project.tasks.filter((n: ITask) => n.dataIndex === day).map(v => v.name)
            ans.push(...res)
        }
        return ans
    }
}

let model = new Model(templateJson as unknown as IProject[])

export default reactive(model)