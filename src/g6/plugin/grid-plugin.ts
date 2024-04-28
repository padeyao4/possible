import { Extensions } from '@antv/g6'
import { createDOM } from '@antv/g6/lib/util/dom'
import { modifyCSS } from '@antv/dom-util'
import { OFFSET_ORIGIN_POINT } from '@/configs/constant'

export default class GridPlugin extends Extensions.BasePlugin {
  private canvas: HTMLElement
  private container: HTMLElement
  private grid: HTMLElement

  init(graph: any) {
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

    const container = this.container

    if (container?.parentNode) container.parentNode.removeChild(container)
  }

  updateGrid() {
    const x = this.graph.getCanvasByViewport(OFFSET_ORIGIN_POINT).x
    const transform = `matrix(1,0,0,1,${-x % 120},0)`
    modifyCSS(this.grid, {
      transform
    })
  }
}
