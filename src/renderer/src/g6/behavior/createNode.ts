import { Extensions, IG6GraphEvent } from '@antv/g6'
import { PNode } from '@renderer/model'

export default class CreateNode extends Extensions.BaseBehavior {
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
}
