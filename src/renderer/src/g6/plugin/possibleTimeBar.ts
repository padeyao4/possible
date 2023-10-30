import { IGraph, IGroup } from '@antv/g6'
import { createDom, modifyCSS } from '@antv/dom-util'
import { Canvas } from '@antv/g-canvas'
import { timeBarShow } from '@renderer/util'

interface TimeBarConfig {
  baseDate: Date
  today: any
}

export class PossibleTimeBar {
  public objs: Record<string, unknown>
  private readonly config: TimeBarConfig

  constructor(config: TimeBarConfig) {
    this.objs = {}
    this.config = config
    console.log('plugin config', config)
  }

  set(k: string, v: unknown) {
    this.objs[k] = v
  }

  get(k: string) {
    return this.objs[k]
  }

  destroyPlugin() {
    console.log('destroy possible time bar')
    const graph = this.get('graph') as IGraph
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

    this.config.today.$subscribe(() => {
      group.emit('possible-update', { x: graph.getCanvasByPoint(0, 0).x })
    })

    this.set('group', group)

    const baseTime: Date = this.config.baseDate

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
        value.attr(
          'fill',
          Math.floor(this.config.today.data.getTime() / 86400_000) -
            Math.floor((new Date(baseTime).getTime() + n * 86400_000) / 86400_000) ===
            0
            ? '#a10066'
            : '#9e9e9e'
        )
      })
    })
  }

  update = ({ matrix }: { matrix: number[] }) => {
    const group = this.get('group') as IGroup
    group.setMatrix([1, 0, 0, 0, 1, 0, matrix[6] % 120, 0, 1])
    group.emit('possible-update', { x: matrix[6] })
  }
}
