import { Canvas } from '@antv/g'
import { IGraph, PluginBase } from '@antv/g6'
import { modifyCSS } from '@antv/dom-util'
import { createDOM } from '@antv/g6/lib/util/dom'

export default class GridPlugin extends PluginBase {
  private canvas: Canvas
  private container: HTMLElement
  private gridContainer: HTMLElement

  public init(graph: IGraph) {
    super.init(graph)
    const graphContainer = graph.container
    const canvas = this.canvas || graphContainer.firstChild?.nextSibling

    const container: HTMLElement = createDOM(`<div class='g6-grid-container'></div>`)

    const gridContainer: HTMLElement = createDOM(`<div class='g6-grid'></div>`)

    container.appendChild(gridContainer)
    graphContainer.insertBefore(container, canvas as unknown as Node)

    this.container = container
    this.gridContainer = gridContainer
  }

  // class-methods-use-this
  public getEvents() {
    return {
      viewportchange: this.updateGrid
    }
  }

  public destroy() {
    super.destroy()
    this.canvas?.destroy()

    const container = this.container

    if (container?.parentNode) container.parentNode.removeChild(container)
  }

  protected updateGrid() {
    const x = this.graph.getCanvasByViewport({ x: 0, y: 0 }).x
    const transform = `matrix(1,0,0,1,${-x % 120},0)`
    modifyCSS(this.gridContainer, {
      transform
    })
  }
}
