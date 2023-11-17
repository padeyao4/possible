import {Point} from "@antv/g-base";
import {v4} from "uuid";
import {GraphData} from "@antv/g6";
import {EdgeConfig, NodeConfig} from "@antv/g6-core";

export namespace Possible {
    export interface IEdge extends EdgeConfig {
        id: string
        source: string // task id
        target: string // task id
    }

    export interface INode extends NodeConfig {
        name: string
        id: string
        y: number
        x: number,
        createdTime: Date
        updatedTime: Date
        state: 'completed' | 'timeout' | 'discard' | 'normal'
        target: string // 任务目标
        detail: string // 任务详情
        note: string // 笔记
        /**
         * 任务类型，周期任务，定时任务，一般任务
         */
        taskType: 'period' | 'schedule' | 'general',
        /**
         * 用于排序
         */
        orderIndex: number
        width: number,
        height: number,
        margin: number[] // 数组长度为4,上右下左
        projectId: string
    }

    export interface IData extends GraphData {
        nodes: INode[]
        edges: IEdge[]
    }

    export interface IProject {
        name: string
        id: string
        createdTime: Date
        offset: Point,
        data: IData
        initDate: Date
        completedDate: Date
        completed: boolean
        nodeWidth: number
        nodeHeight: number
        nodeMargin: number[]
    }

    export class Project implements IProject {
        name: string;
        completed: boolean;
        completedDate: Date;
        createdTime: Date;
        data: IData;
        id: string;
        initDate: Date;
        offset: Point;
        nodeHeight: number;
        nodeMargin: number[];
        nodeWidth: number;

        constructor(name: string) {
            this.name = name;
            this.completed = false
            this.completedDate = new Date()
            this.createdTime = new Date()
            this.data = {nodes: [], edges: []}
            this.id = v4()
            this.initDate = new Date()
            this.offset = {x: 0, y: 0}
            this.nodeHeight = 40
            this.nodeWidth = 100
            this.nodeMargin = [40, 10, 40, 10]
        }

        get cellWidth() {
            return this.nodeWidth + this.nodeMargin[1] + this.nodeMargin[3]
        }
    }

    export class Node implements INode {
        name: string;
        createdTime: Date;
        detail: string;
        id: string;
        note: string;
        orderIndex: number;
        state: "completed" | "timeout" | "discard" | "normal";
        target: string;
        taskType: "period" | "schedule" | "general";
        updatedTime: Date;
        x: number;
        y: number;
        height: number;
        width: number;
        margin: number[];
        projectId: string

        [key: string]: any

        constructor(name: string = '', projectId: string = '') {
            this.name = name;
            this.createdTime = new Date()
            this.detail = ''
            this.id = v4()
            this.note = ''
            this.orderIndex = 0
            this.state = 'normal'
            this.target = ''
            this.taskType = 'general'
            this.updatedTime = new Date()
            this.x = 0
            this.y = 0
            this.height = 40
            this.width = 100
            this.margin = [40, 10, 40, 10]
            this.projectId = projectId
        }

        get position() {
            return {x: this.x, y: this.y}
        }

        set position(p: { x: number, y: number }) {
            this.x = p.x
            this.y = p.y
        }

        get cellWidth() {
            return this.width + this.margin[1] + this.margin[3]
        }

        get cellHeight() {
            return this.height + this.margin[0] + this.margin[2]
        }

        get index() {
            return (this.x - Math.floor(this.cellWidth / 2)) / this.cellWidth
        }

        normalXY(x: number, y: number) {
            this.x = Math.floor(x / this.cellWidth) * this.cellWidth + Math.floor(this.cellWidth / 2)
            this.y = y
        }
    }
}
