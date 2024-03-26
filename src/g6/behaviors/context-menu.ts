import { Extensions, type IG6GraphEvent } from '@antv/g6'
import { useStore } from '@/stores/store'

export default class ContextMenu extends Extensions.BaseBehavior {
  store = useStore()

  getEvents() {
    return {
      'node:contextmenu': this.onNodeContextmenu,
      'canvas:contextmenu': this.onCanvasContextmenu,
      'edge:contextmenu': this.onEdgeContextmenu
    }
  }

  onEdgeContextmenu(e: IG6GraphEvent) {
    const { x, y } = e.canvas
    this.store.mousePosition = { x, y }
    this.store.selectedItem = this.graph.getEdgeData(e.itemId)
    this.store.actionState = 'edge:contextmenu'
  }

  onCanvasContextmenu(e: IG6GraphEvent) {
    const { x, y } = e.canvas
    this.store.mousePosition = { x, y }
    this.store.actionState = 'canvas:contextmenu'
  }

  onNodeContextmenu(e: IG6GraphEvent) {
    const { itemId } = e
    const { x, y } = e.canvas
    this.store.selectedItem = this.graph.getNodeData(itemId)
    this.store.mousePosition = { x, y }
    this.store.actionState = 'node:contextmenu'
  }
}