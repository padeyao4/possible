import { Behavior, IG6GraphEvent, IGraph } from '@antv/g6'
import { PNode } from '@renderer/model'

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
    const node = new PNode()
    node.name = 'untitled'
    node.normalXY(e.canvas.x, e.canvas.y)
    node.projectId = window.location.pathname.split('/').pop() as string
    this.graph.addData('node', node.toGraphNode())
  }

  updateConfig(options: any): void {
    this.options = { ...this.options, ...options }
  }

  destroy(): void {
    return
  }
}
