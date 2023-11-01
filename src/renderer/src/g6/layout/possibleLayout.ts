import G6 from '@antv/g6'
import { IRelation, ITask } from '@renderer/store'
import { index2X } from '@renderer/util'
import { EdgeConfig, NodeConfig } from '@antv/g6-core'

// type R = {
//   source: string
//   target: string
//   startIndex: number
//   endIndex: number
//   box: IBBox
// }

G6.registerLayout('possible-layout', {
  /**
   * 定义自定义行为的默认参数，会与用户传入的参数进行合并
   */
  getDefaultCfg() {
    console.debug('layout: get default cfg')
    return {
      todayIndex: this.todayIndex,
      nodeHeight: 80,
      gap: 32
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
    const indexMap = new Map<string, number>()
    edges
      .sort((e1, e2) => {
        return e1.startPoint!.x - e2.startPoint!.x
      })
      .map((edge) => {
        return [edge.source, edge.target]
      })
      .flat()
      .forEach((value, index) => {
        indexMap.set(value, index)
      })
    console.log('layout index map', indexMap)

    map.forEach((items) => {
      items
        .sort((n1, n2) => {
          return (indexMap.get(n1.id) ?? 9999) - (indexMap.get(n2.id) ?? 9999)
        })
        .forEach((item, index) => {
          item.y = index * nodeHeight + gap
        })
    })

    console.log('layout map', map)

    // todo 开空间曲线最大值
    // [0,99,100,110]
    // [1,1000,3]

    // const edgeBBoxes: R[] = []
    // edges.forEach((edge) => {
    //   const bbox = createBBoxByEdgeCfg(edge)
    //   edgeBBoxes.push({
    //     source: edge.source,
    //     target: edge.target,
    //     box: bbox,
    //     startIndex: bbox.x,
    //     endIndex: bbox.x + bbox.width
    //   })
    // })

    // todo 排序节点
    // edgeBBoxes.forEach((b) => {
    //   nodes.forEach((n) => {
    //     if (n.id === b.target || n.id === b.target) {
    //       return
    //     }
    //     if (n.x < b.startIndex || n.x > b.endIndex) {
    //       return
    //     }
    //     if (collision(b.box, createBBoxByNodeCfg(n))) {
    //       n.y += b.box.height + gap
    //     }
    //   })
    // })

    map.clear()
  },
  /**
   * 销毁
   */
  destroy() {
    return
  }
})
