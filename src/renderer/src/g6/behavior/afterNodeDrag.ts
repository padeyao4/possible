import { Extensions, IG6GraphEvent } from '@antv/g6'

export class NodeDragEnd extends Extensions.BaseBehavior {
  getEvents(): { [p: string]: (event: IG6GraphEvent) => void } {
    return {
      'node:dragend': this.dragend
    }
  }

  dragend(e: IG6GraphEvent) {
    console.log('dragend', e)
    const { id, data } = this.graph.getNodeData(e.itemId)!
    console.log('data', data)
    // const node = plainToInstance(PNode, nodeData?.data)
    // const graphNode = node.normal().toGraphNode()
    // todo
    // graph.updateData('node', graphNode)
    this.graph.updateData('node', {
      id,
      data: {
        ...data,
        name: 'hello world'
      }
    })
  }
}
