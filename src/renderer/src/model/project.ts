import {IProject} from "@renderer/model/index";
import {Point} from "@antv/g-base";
import {v4} from "uuid";

export namespace Possible {
  export class Project implements IProject {
    name: string;
    completed: boolean;
    completedDate: Date;
    createdTime: Date;
    data: unknown;
    id: string;
    initDate: Date;
    offset: Point;


    constructor(name: string) {
      this.name = name;
      this.completed = false
      this.completedDate = new Date()
      this.createdTime = new Date()
      this.data = {nodes: [], edges: []}
      this.id = v4()
      this.initDate = new Date()
      this.offset = {x: 0, y: 0}
    }
  }
}
