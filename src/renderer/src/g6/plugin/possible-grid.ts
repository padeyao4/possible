import { each, wrapBehavior } from '@antv/util'
import { createDom, modifyCSS } from '@antv/dom-util'
import { Graph } from '@antv/g6'
import img from '@renderer/assets/120-bg.png' // 网格背景图片

export default class PossibleGrid {
  private _cfgs: Record<string, any> = {}
  private _events: object

  constructor() {
    this._cfgs = {}
    this._events = []
  }

  set(k: string, v: object) {
    this._cfgs[k] = v
  }

  get(k: string) {
    return this._cfgs?.[k]
  }

  /**
   * call by g6 graph
   * @param graph
   */
  initPlugin(graph: Graph) {
    this.set('graph', graph)
    const events = this.getEvents()
    const bindEvents: Record<string, any> = {}

    each(events, (v, k) => {
      const event: any = wrapBehavior(this, v)
      bindEvents[k] = event
      graph.on(k, event)
    })
    this._events = bindEvents
    this.init()
  }

  init() {
    const graph = this.get('graph')
    const graphContainer = graph.getContainer()
    const canvas = graph.get('canvas').get('el')
    const container = createDom(
      `<div class='g6-grid-container' style="position:absolute;overflow:hidden;z-index: -1;"></div>`
    )
    const gridContainer = createDom(
      `<div class='g6-grid' style='position:absolute; background-image: url("${img}"); user-select: none'></div>`
    )
    this.set('container', container)
    this.set('gridContainer', gridContainer)

    this.positionInit()

    container.appendChild(gridContainer)
    graphContainer.insertBefore(container, canvas)
  }

  positionInit() {
    const graph = this.get('graph')
    const minZoom = graph.getMinZoom()
    const width = graph.getWidth()
    const height = graph.getHeight()

    modifyCSS(this.get('container'), {
      width: `${width}px`,
      height: `${height}px`
    })

    // 网格 40*40 需保证 (gridContainerWidth / 2) % 40 = 0 才能让网格线对齐左上角 故 * 80
    const gridContainerWidth = (width * 240) / minZoom
    const gridContainerHeight = (height * 240) / minZoom
    modifyCSS(this.get('gridContainer'), {
      width: `${gridContainerWidth}px`,
      height: `${gridContainerHeight}px`,
      left: `-${gridContainerWidth / 2}px`,
      top: `-${gridContainerHeight / 2}px`
    })
  }

  update(param: any) {
    const gridContainer = this.get('gridContainer')
    let { matrix }: any = param ? param : {}
    if (!matrix) matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]

    const isFollow = true // follow viewport change
    const transform = `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[3]}, ${matrix[4]}, ${
      isFollow ? matrix[6] : '0'
    }, ${isFollow ? matrix[7] : '0'})`

    modifyCSS(gridContainer, {
      transform
    })
  }

  getEvents() {
    return {
      viewportchange: 'update'
    }
  }

  destroyPlugin() {
    const graph = this.get('graph')
    const events = this._events
    each(events, (v, k) => {
      graph.off(k, v)
    })

    this._events = {}
    this._cfgs = {}
  }
}
