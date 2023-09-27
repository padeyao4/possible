import G6, { BehaviorOption } from '@antv/g6'
import PossibleNodeDrag from './behavior/possible-node-drag'

const behaviors: Record<string, unknown> = {
  'possible-drag-node': PossibleNodeDrag
}

for (const key in behaviors) {
  G6.registerBehavior(key, <BehaviorOption>behaviors[key])
}

G6.registerNode(
  'task-node',
  {
    draw(cfg, group) {
      const keyShape = group.addShape('rect', {
        attrs: {
          fill: '#fff',
          ...cfg.style
        }
      })
      return keyShape
    }
  },
  'rect'
)
