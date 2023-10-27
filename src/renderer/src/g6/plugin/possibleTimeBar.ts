import { IGraph } from '@antv/g6'
import { createDom, modifyCSS } from '@antv/dom-util'
import { Canvas } from '@antv/g-canvas'

// <!--        <div-->
// <!--          class="time-bar"-->
// <!--          @wheel="-->
//   <!--            (e: any) => {-->
// <!--              graph?.translate(e.deltaY / 5, 0)-->
// <!--            }-->
// <!--          "-->
// <!--        >-->
// <!--          <div-->
// <!--            v-for="timeItem in timeItems"-->
//   <!--            :key="timeItem"-->
// <!--            class="time-item"-->
//   <!--            :style="{ translate: translateX + 'px' }"-->
//   <!--            :class="{ active: timeItem === todayActiveIndex }"-->
//   <!--          >-->
//   <!--            <div>-->
//   <!--              <div>-->
//   <!--                {{ new Intl.DateTimeFormat('zh-Hans').format(index2Date(timeItem)) }}-->
// <!--              </div>-->
//         <!--              <p>星期{{ date2Day(index2Date(timeItem)) }}</p>-->
//         <!--            </div>-->
//         <!--          </div>-->
//         <!--        </div>-->

// const timeItems = computed(() => {
//   console.log('computed time items')
//   const x = offset.value.x
//   const n = Math.floor(Math.abs(x / 120)) * (x >= 0 ? 1 : -1)
//   return [...new Array(25).keys()]
//     .map((i) => i - n - 1 + date2Index(new Date(projectStore.get(props.id).initDate)))
//     .filter((n) => !isNaN(n))
// })
//
// const translateX = computed(() => {
//   console.log('computed translateX', offset)
//   return (offset.value.x % 120) - 240
// })

export class PossibleTimeBar {
  public objs: Record<string, any>
  private readonly config: { baseDate: Date }

  constructor(config: { baseDate: Date }) {
    this.objs = {}
    this.config = config
    console.log('date', this.config)
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
    this.set('canvas', canvas)

    const o = graph.getCanvasByPoint(0, 0)
    const offsetX = o.x % 120

    graph.on('viewportchange', this.update)

    const group = canvas.addGroup({
      name: 'possible-time-bar-group'
    })

    this.set('group', group)

    // todo canvas update shape

    for (let i = 0; i < 24; i++) {
      group.addShape('text', {
        attrs: {
          fill: '#ff0000',
          stroke: '#fff',
          lineWidth: 1,
          x: 120 * i + offsetX,
          y: 0,
          textAlign: 'center',
          text: i,
          textBaseline: 'top',
          fontSize: 15
        },
        capture: false,
        name: i
      })
    }
  }

  update = (params: { action: string; matrix: number[] }) => {
    const canvas: Canvas = this.get('canvas')
    const mat3 = [...params.matrix]
    mat3[7] = 0
    mat3[6] %= 120
    canvas.setMatrix(mat3)
  }
}
