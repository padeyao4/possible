import G6 from '@antv/g6'

G6.registerBehavior('possible-canvas-drag', {
  drag: false,
  mouseDefaultStyle: 'pointer',

  getEvents() {
    return {
      'canvas:drag': 'onCanvasDrag',
      'canvas:dragstart': 'onCanvasDragStart',
      'canvas:dragend': 'onCanvasDragEnd'
    }
  },
  onCanvasDrag() {
    ;(this.onCanvasDragStart as () => void)()
  },
  onCanvasDragStart() {
    if (this.drag) return
    this.drag = true
    this.mouseDefaultStyle = document.body.style.cursor
    document.body.style.cursor = 'move'
    console.log('canvas drag start')
  },
  onCanvasDragEnd() {
    if (!this.drag) return
    this.drag = false
    document.body.style.cursor = this.mouseDefaultStyle as string
    console.log('canvas drag end')
  }
})
