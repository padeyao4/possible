import { IGraph, IGroup } from '@antv/g6'
import { createDom, modifyCSS } from '@antv/dom-util'
import { Canvas } from '@antv/g-canvas'
import { timeBarShow } from '@renderer/util'
import { isReactive, isRef } from 'vue'

export class PossibleTimeBar {
  public objs: Record<string, any>
  private readonly config: { baseDate: Date }

  constructor(config: { baseDate: Date }) {
    this.objs = {}
    this.config = config
    console.log('date', this.config.baseDate)
  }

  set(k: string, v: any) {
    this.objs[k] = v
  }

  get(k: string) {
    return this.objs[k]
  }

  destroyPlugin() {
    console.log('destroy possible time bar')
    const graph: IGraph = this.get('graph')
    graph.off('viewportchange', this.update)
  }

  initPlugin(graph: IGraph) {
    this.set('graph', graph)
    const possibleTimeBarContainer = createDom('<div class="possible-time-bar"></div>')
    modifyCSS(possibleTimeBarContainer, { position: 'relative' })
    const graphContainer = graph.getContainer()
    graphContainer.parentElement?.insertBefore(possibleTimeBarContainer, graphContainer)
    const canvas = new Canvas({
      container: possibleTimeBarContainer,
      width: graphContainer.clientWidth,
      height: 40
    })
    window.addEventListener('resize', () => {
      canvas.changeSize(graphContainer.clientWidth, 40)
    })
    this.set('canvas', canvas)

    const o = graph.getCanvasByPoint(0, 0)
    const offsetX = o.x % 120

    graph.on('viewportchange', this.update)

    const group = canvas.addGroup({
      name: 'possible-time-bar-group'
    })

    this.set('group', group)

    const baseTime: Date = this.config.baseDate
    console.log('base time', baseTime)
    console.log('is reactive', isReactive(baseTime))
    console.log('is ref', isRef(baseTime))

    for (let i = 0; i < 24; i++) {
      group.addShape('text', {
        attrs: {
          fill: '#9e9e9e',
          stroke: '#fff',
          lineWidth: 1,
          x: 120 * i + offsetX - 180,
          y: 0,
          textAlign: 'center',
          text: timeBarShow(baseTime, i - 2),
          textBaseline: 'top',
          fontSize: 15
        },
        capture: false,
        id: i.toString()
      })
    }
    group.on('possible-update', (e: { x: number }) => {
      const offset = -Math.floor(e.x / 120)
      group.getChildren().forEach((value) => {
        const n = offset + parseInt(value.cfg.id) + (offset >= 1 ? -1 : 0) - 2
        value.attr('text', timeBarShow(baseTime, n))
      })
    })
  }

  update = ({ matrix }: { matrix: number[] }) => {
    const group: IGroup = this.get('group')
    group.setMatrix([1, 0, 0, 0, 1, 0, matrix[6] % 120, 0, 1])
    group.emit('possible-update', { x: matrix[6] })
  }
}
