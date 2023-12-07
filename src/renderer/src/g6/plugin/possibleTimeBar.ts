import {IGraph, IGroup} from '@antv/g6'
import {modifyCSS} from '@antv/dom-util'
import {Canvas, ShapeCfg} from '@antv/g-canvas'
import {timeBarShow} from '@renderer/util'
import {useDateStore} from '@renderer/store/date'
import {getZoneTimeMs} from "@renderer/util/time";
import {DAY_OF_MS} from "@renderer/common/constant";
import {Possible} from "@renderer/model";
import {useProjectStore} from "@renderer/store/project";
import {useRoute} from "vue-router";
import IProject = Possible.IProject;

export class PossibleTimeBar {
  objs: Record<string, unknown>
  startIndex: number
  endIndex: number
  timeItems: number[]
  projectStore = useProjectStore()
  project: IProject = this.projectStore.get(useRoute().params.id as string)!
  timeBar: HTMLElement

  dateStore = useDateStore()

  constructor(timeBar: HTMLElement) {
    this.startIndex = 0
    this.endIndex = 22
    this.timeItems = Array.from({length: this.endIndex - this.startIndex + 1}, (_, i) => i)
    this.objs = {}
    this.timeBar = timeBar
  }

  textAttr = (index: number) => {
    return {
      attrs: {
        fill: '#9e9e9e',
        stroke: '#fff',
        lineWidth: 0,
        x: 120 * index - 180,
        y: 5,
        textAlign: 'center',
        text: timeBarShow(this.project.initDate, index - 2),
        textBaseline: 'top',
        fontSize: 14
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
    const graph = this.get('graph') as IGraph
    graph.off('viewportchange', this.viewportUpdate)
  }

  /**
   * 根据当前时间和创建时间计算index值。
   * 注意: 当前时间不是实时同步，会出现当前时间小于创建时间的错误
   */
  todayIndex = () => {
    return (
      Math.floor(getZoneTimeMs(this.dateStore.now) / DAY_OF_MS) -
      Math.floor(getZoneTimeMs(this.project.initDate) / DAY_OF_MS) +
      2
    )
  }

  initPlugin(graph: IGraph) {
    this.set('graph', graph)
    modifyCSS(this.timeBar, {position: 'relative'})
    const graphContainer = graph.getContainer()
    const canvas = new Canvas({
      container: this.timeBar,
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

    this.dateStore.$subscribe(() => {
      group.emit('possible-today', {index: this.todayIndex()})
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
      if (index >= this.startIndex || index <= this.endIndex) {
        group.emit('possible-today', {index})
      }
    })

    group.on('possible-today', (e: { index: number }) => {
      const item = group.findById(e.index.toString())
      if (item !== undefined) {
        group.getChildren().forEach((v) => v.attr('fill', '#9e9e9e'))
        item?.attr('fill', '#a10066')
      }
    })
    group.emit('possible-today', {index: this.todayIndex()})
  }

  viewportUpdate = ({matrix}: { matrix: number[] }) => {
    const group = this.get('group') as IGroup
    group.emit('possible-update', {x: matrix[6]})
  }
}
