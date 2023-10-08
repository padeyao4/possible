import G6, { BehaviorOption } from '@antv/g6'
import PossibleNodeDrag from './behavior/possible-node-drag'

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
