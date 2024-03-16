import { Extensions } from '@antv/g6'
import { createDOM } from '@antv/g6/lib/util/dom'
import { modifyCSS } from '@antv/dom-util'

export default class GridPlugin extends Extensions.BasePlugin {
  init(graph) {
    super.init(graph)
    const graphContainer = graph.container
    const canvas = this.canvas || graphContainer.firstChild?.nextSibling

    const container = createDOM(`<div class='g6-grid-container'></div>`)

    const grid = createDOM(`<div class='g6-grid'></div>`)

    container.appendChild(grid)
    graphContainer.insertBefore(container, canvas)

    this.container = container
    this.grid = grid
  }

  getEvents() {
    return {
      viewportchange: this.updateGrid
    }
  }

  destroy() {
    super.destroy()
    this.canvas?.destroy()

    const container = this.container

    if (container?.parentNode) container.parentNode.removeChild(container)
  }

  protected

  updateGrid() {
    const x = this.graph.getCanvasByViewport({ x: 0, y: 0 }).x
    const transform = `matrix(1,0,0,1,${-x % 120},0)`
    modifyCSS(this.grid, {
      transform
    })
  }
}
