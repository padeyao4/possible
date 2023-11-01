import G6 from '@antv/g6'
import { IRelation, ITask } from '@renderer/store'
import { index2X } from '@renderer/util'
import { EdgeConfig, NodeConfig } from '@antv/g6-core'

G6.registerLayout('possible-layout', {
  /**
   * 定义自定义行为的默认参数，会与用户传入的参数进行合并
   */
  getDefaultCfg() {
    console.debug('layout: get default cfg')
    return {
      todayIndex: this.todayIndex,
      nodeHeight: 80,
      gap: 100
    }
  },

  /**
   * 执行布局
   */
  execute() {
    console.debug('layout execute')
    const {
      todayIndex,
      nodeHeight,
      gap,
      nodes,
      edges
    }: {
      todayIndex: number
      nodeHeight: number
      gap: number
      nodes: (ITask & NodeConfig)[]
      edges: (EdgeConfig & IRelation)[]
    } = this

    const map = new Map<number, (ITask & NodeConfig)[]>()

    const idx = index2X(todayIndex)

    nodes
      .map((n) => {
        if (n.state === 'normal' && n.taskType === 'general' && n.x < idx) {
          n.x = idx
        }
        return n
      })
      .sort((n1, n2) => n1.y - n2.y)
      .forEach((n) => {
        const r = map.get(n.x)
        if (r === undefined) {
          map.set(n.x, [n])
        } else {
          r.push(n)
        }
      })

    map.forEach((items) => {
      const ySet = new Set<number>()
      items.forEach((item) => {
        // item.y = index * nodeHeight + gap
        item.y = Math.floor(item.y / gap) * gap + 42
        while (ySet.has(item.y)) {
          item.y += gap
        }
        ySet.add(item.y)
      })
    })

    map.clear()
  },
  /**
   * 销毁
   */
  destroy() {
    return
  }
})
