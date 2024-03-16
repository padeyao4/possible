import { Extensions } from '@antv/g6'

export default class ContextMenu extends Extensions.BaseBehavior {
  getEvents() {
    return {
      // 'contextmenu': this.onContextmenu
      'node:contextmenu': this.onNodeContextmenu
      // 'node:mouseleave': () => console.log('leave')
    }
  }

  onNodeContextmenu(e) {
    const { itemId } = e
    const { x, y } = e.canvas
    const { userData } = this.graph
    userData.selectItem = this.graph.getNodeData(itemId)
    userData.pointerPosition = { x, y }
    userData.status = 'contextmenu'

    setTimeout(() => {
      window.addEventListener('mousedown', function() {
        userData.status = 'none'
        window.removeEventListener('mousedown', this)
      }, { once: true })
    })
  }
}