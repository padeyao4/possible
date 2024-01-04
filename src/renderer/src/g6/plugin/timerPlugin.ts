import { IGraph, IPluginBaseConfig, PluginBase } from '@antv/g6'
import { Canvas, Group, Text } from '@antv/g'
import { createCanvas } from '@antv/g6/lib/util/canvas'
import { timeBarShow } from '@renderer/util'
import { PProject } from '@renderer/model'
import { useStore } from '@renderer/store/project'
import { computed, watch } from 'vue'

export default class timerPlugin extends PluginBase {
  public canvas: Canvas
  public width: number
  public container: HTMLElement
  public group: Group
  public startIndex: number
  public endIndex: number
  public timeItems: number[]
  public project: PProject

  private store = useStore()

  /**
   * 今天距离项目创建的天数值
   */
  idx = computed(() => {
    return this.store.dn - this.project.origin
  })

  constructor(options: IPluginBaseConfig) {
    super(options)
    this.container = options.container as HTMLElement
    this.project = options.project as PProject
  }

  moveLeftTimeItems(count: number) {
    const group = this.group
    while (count--) {
      this.startIndex--
      this.endIndex--
      const id = this.timeItems.pop()
      group.removeChild(group.getElementById(id!.toString())!)
      this.timeItems.unshift(this.startIndex)
      group.appendChild(this.createText(this.startIndex))
    }
  }

  moveRightTimeItems(count: number) {
    const group = this.group
    while (count--) {
      this.startIndex++
      this.endIndex++
      const id = this.timeItems.shift()
      group.removeChild(group.getElementById(id!.toString())!)
      this.timeItems.push(this.endIndex)
      group.appendChild(this.createText(this.endIndex))
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

  createText(v: number) {
    return new Text({
      style: {
        text: timeBarShow(this.project.origin + v),
        fontFamily: 'Avenir', // 字体
        fontSize: 14, // 字号
        fontWeight: 1,
        x: 120 * v + 60,
        y: 5,
        fill: v === this.idx.value ? '#ff0' : '#000', // 文本颜色
        textAlign: 'center', // 水平居中
        textBaseline: 'top' // 垂直居中
      },
      id: v.toString()
    })
  }

  initTimeItems = () => {
    this.startIndex = 0
    const { clientWidth } = this.container
    this.endIndex = Math.floor(clientWidth / 120) + 5
    this.timeItems = Array.from({ length: this.endIndex - this.startIndex + 1 }, (_, i) => i)
    this.group.removeChildren()
    this.timeItems.forEach((v) => {
      this.group.appendChild(this.createText(v))
    })
  }

  init(graph: IGraph) {
    super.init(graph)
    const { clientWidth, clientHeight } = this.container
    this.canvas = createCanvas('canvas', this.container, clientWidth, clientHeight, undefined, {
      background: '#259eb2'
    })
    this.group = new Group()
    this.canvas.appendChild(this.group)
    this.initTimeItems()
    window.addEventListener('resize', this.resizeCanvas)
    watch(
      () => this.store.dn,
      () => {
        this.group.forEach((e) => {
          const text = e as Text
          text.style.fill = text.id === this.idx.value.toString() ? '#ff0' : '#000'
        })
      }
    )
  }

  resizeCanvas = () => {
    const { clientWidth } = this.container
    this.canvas.resize(clientWidth, 40)
    this.initTimeItems()
  }

  destroy() {
    super.destroy()
    window.removeEventListener('resize', this.resizeCanvas)
  }

  updateTimer() {
    const x = this.graph.getCanvasByViewport({ x: 0, y: 0 }).x
    this.group.setPosition(-x, 0)
    const n = Math.floor(x / 120)
    this.updateTimeItems(n - 2)
  }

  getEvents() {
    return {
      viewportchange: this.updateTimer
    }
  }
}
