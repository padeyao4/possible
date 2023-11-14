import {INode} from "@renderer/model/index";
import {v4} from "uuid";

export namespace Possible {
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

        constructor(name: string, projectId: string) {
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
