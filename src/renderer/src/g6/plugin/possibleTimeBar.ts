import { IGraph, IGroup } from '@antv/g6'
import { createDom, modifyCSS } from '@antv/dom-util'
import { Canvas, ShapeCfg } from '@antv/g-canvas'
import { timeBarShow } from '@renderer/util'
import { useTodayStore } from '@renderer/store/day'
import { IProject } from '@renderer/store'

export class PossibleTimeBar {
  objs: Record<string, unknown>
  startIndex: number
  endIndex: number
  timeItems: number[]
  project: IProject

  todayStore = useTodayStore()

  constructor(project: IProject) {
    this.startIndex = 0
    this.endIndex = 22
    this.timeItems = Array.from({ length: this.endIndex - this.startIndex + 1 }, (_, i) => i)
    this.objs = {}
    this.project = project
  }

  textAttr = (index: number) => {
    return {
      attrs: {
        fill: '#9e9e9e',
        stroke: '#fff',
        lineWidth: 1,
        x: 120 * index - 180,
        y: 0,
        textAlign: 'center',
        text: timeBarShow(this.project.initDate, index - 2),
        textBaseline: 'top',
        fontSize: 15
      },
      capture: false,
      id: index.toString()
    }
  }

  moveLeftTimeItems(count: number) {
    const group = this.get('group') as IGroup
    while (count--) {
      this.startIndex--
      this.endIndex--
      const id = this.timeItems.pop() as number
      group.removeChild(group.findById(id.toString()), true)
      this.timeItems.unshift(this.startIndex)
      group.addShape('text', this.textAttr(this.startIndex) as ShapeCfg)
    }
  }

  moveRightTimeItems(count: number) {
    const group = this.get('group') as IGroup
    while (count--) {
      this.startIndex++
      this.endIndex++
      const id = this.timeItems.shift() as number
      group.removeChild(group.findById(id.toString()), true)
      this.timeItems.push(this.endIndex)
      group.addShape('text', this.textAttr(this.endIndex) as ShapeCfg)
    }
  }

  updateTimeItems(n: number) {
    if (n < this.startIndex) {
      const delta = this.startIndex - n
      this.moveLeftTimeItems(delta)
    }
    if (n > this.startIndex) {
      const delta = n - this.startIndex
      this.moveRightTimeItems(delta)
    }
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
    graph.off('viewportchange', this.viewportUpdate)
  }

  /**
   * 根据当前时间和创建时间计算index值。
   * 注意: 当前时间不是实时同步，会出现当前时间小于创建时间的错误
   */
  todayIndex = () => {
    return (
      Math.floor(new Date(this.todayStore.today).getTime() / 86400_000) -
      Math.floor(new Date(this.project.initDate).getTime() / 86400_000) +
      2
    )
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

    graph.on('viewportchange', this.viewportUpdate)

    const group = canvas.addGroup({
      name: 'possible-time-bar-group'
    })

    this.todayStore.$subscribe(() => {
      group.emit('possible-today', { index: this.todayIndex() })
    })

    this.set('group', group)

    this.timeItems.forEach((v) => {
      group.addShape('text', this.textAttr(v) as ShapeCfg)
    })

    group.on('possible-update', (e: { x: number }) => {
      canvas.setMatrix([1, 0, 0, 0, 1, 0, e.x, 0, 1])
      const n = -Math.floor(e.x / 120)
      this.updateTimeItems(n)
      const index = this.todayIndex()
      console.debug('time bar index', index)
      if (index >= this.startIndex || index <= this.endIndex) {
        group.emit('possible-today', { index })
      }
    })

    group.on('possible-today', (e: { index: number }) => {
      const item = group.findById(e.index.toString())
      if (item !== undefined) {
        group.getChildren().forEach((v) => v.attr('fill', '#9e9e9e'))
        item?.attr('fill', '#a10066')
      }
    })
    group.emit('possible-today', { index: this.todayIndex() })
  }

  viewportUpdate = ({ matrix }: { matrix: number[] }) => {
    const group = this.get('group') as IGroup
    group.emit('possible-update', { x: matrix[6] })
  }
}
