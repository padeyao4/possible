import G6, { BehaviorOption } from '@antv/g6'
import PossibleNodeDrag from './behavior/possible-node-drag'
import { ITask } from '@renderer/store'
import { index2X } from '@renderer/util'

const behaviors: Record<string, unknown> = {
  'possible-drag-node': PossibleNodeDrag
}

for (const key in behaviors) {
  G6.registerBehavior(key, <BehaviorOption>behaviors[key])
}

const stateMapper = {
  completed: '#bdbbbb',
  normal: '#70bffa',
  timeout: '#d9958d',
  discard: '#e7e590'
}

G6.registerNode(
  'task-node',
  {
    draw(cfg, group) {
      const keyShape = group.addShape('rect', {
        attrs: {
          x: -50,
          y: -20,
          width: 100,
          height: 40,
          radius: 8,
          fill: (cfg.state as string) === '' ? '#70bffa' : stateMapper[cfg.state as string],
          textAlign: 'center',
          ...cfg.style
        },
        name: 'base-rect',
        draggable: true
      })
      group.addShape('text', {
        attrs: {
          width: 100,
          height: 40,
          fill: '#fff',
          textBaseline: 'middle',
          textAlign: 'center',
          text: cfg.name,
          fontSize: 14
        },
        draggable: true
      })
      return keyShape
    },
    update: undefined
  },
  'rect'
)

G6.registerLayout('possible-layout', {
  /**
   * 定义自定义行为的默认参数，会与用户传入的参数进行合并
   */
  getDefaultCfg() {
    return {}
  },

  /**
   * 执行布局
   */
  execute() {
    const nodes: ITask[] = this.nodes
    const gap = this.gap
    const todayIndex = this.todayIndex
    const nodeHeight = this.nodeHeight
    const map = new Map<number, ITask[]>()
    nodes
      .map((n) => {
        const nx = index2X(todayIndex)
        if (n.state === 'normal' && n.taskType === 'general' && n.x < nx) {
          n.x = nx
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
      // const len = items.length
      // const height = nodeHeight * len + gap * (len - 1)
      // const mid = Math.floor(height / 2)
      items.forEach((item, index) => {
        item.y = index * nodeHeight + gap
      })
    })
    map.clear()
  },
  /**
   * 销毁
   */
  destroy() {
    console.log('layout destroy')
    return
  }
})
