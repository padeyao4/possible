import { Behavior, IG6GraphEvent, IGraph } from '@antv/g6'
import { v4 } from 'uuid'

export default class CreateNode implements Behavior {
  graph: IGraph
  options: any

  constructor(option: any) {
    this.options = option
  }

  getEvents(): { [p: string]: (event: IG6GraphEvent) => void } {
    return {
      'canvas:dblclick': this.create
    }
  }

  create = (e: any) => {
    this.graph.addData('node', {
      id: v4(),
      data: {
        x: e.canvas.x,
        y: e.canvas.y,
        name: 'untitled'
      }
    })
  }

  updateConfig(options: any): void {
    this.options = { ...this.options, ...options }
  }

  destroy(): void {
    return
  }
}
