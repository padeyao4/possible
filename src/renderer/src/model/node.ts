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

    [key: string]: any

    constructor(name: string) {
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
    }

    get position() {
      return {x: this.x, y: this.y}
    }

    set position(p: { x: number, y: number }) {
      this.x = p.x
      this.y = p.y
    }
  }
}
