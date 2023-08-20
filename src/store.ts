import {reactive} from "vue";
import {GraphData} from "@antv/g6-core/lib/types";


export interface Node {
    name: string,
    id: string,
    dataIndex: number,
    y: number,
    children: string[]
}

export interface Project {
    name: string,
    key: string,
    nodes: Node[]
}

class Model {
    public active: string
    public projects: Project[]

    public constructor(projects: Project[] = [], active: string = '') {
        this.projects = projects
        this.active = active
    }

    public addProject(name: string) {
        let project: Project = {
            name,
            key: this.projects.length.toString(),
            nodes: [],
        };
        this.projects.push(project)
        return project
    }

    public addTask(projectName: string, taskName: string) {
        let result = this.projects.filter((project: Project) => project.name === projectName);
        if (result.length === 1) {
            result[0].nodes.push({
                id: "", y: 0,
                name: taskName,
                dataIndex: 0, // 时间索引
                children: []
            })
        }
    }

    /**
     * select data based on the project key and covert to data for antv g6
     * @param key
     */
    public dataByKey(key: string): GraphData {
        let projects = this.projects.filter(p => p.key === key)
        if (projects.length === 0) {
            return {
                nodes: [],
                edges: []
            }
        }
        let project = projects[0]
        let nodes = project.nodes

        let edges = []
        for (let i in nodes) {
            let node = nodes[i]
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
            nodes: nodes.map((v) => {
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
            let res = project.nodes.filter((n: Node) => n.dataIndex === day).map(v => v.name)
            ans.push(...res)
        }
        return ans
    }
}

const template: Project[] = [
    {
        name: '1',
        key: '0',
        nodes: [
            {
                name: 'node1',
                id: 'node1',
                dataIndex: 0,
                y: 100,
                children: ['node2', 'node3'],
            },
            {
                name: 'node2',
                id: 'node2',
                dataIndex: 1,
                y: 300,
                children: ['node3'],
            },
            {
                name: 'node3',
                id: 'node3',
                dataIndex: 5,
                y: 400,
                children: [],
            },
            {
                name: 'node4',
                id: 'node4',
                dataIndex: 5,
                y: 410,
                children: [],
            },
        ]
    },
    {
        name: '2',
        key: '1',
        nodes: [
            {
                name: 'x1',
                id: 'x1',
                dataIndex: 0,
                y: 300,
                children: [],
            }]
    }
]

let model = new Model(template)

export default reactive(model)