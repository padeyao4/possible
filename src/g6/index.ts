import G6 from '@antv/g6'
import PossibleNodeDrag from './behavior/possible-node-drag'

const behaviors: Record<string, any> = {
  'possible-drag-node': PossibleNodeDrag
}

export function registerBehaviors() {
  for (const key in behaviors) {
    G6.registerBehavior(key, behaviors[key])
  }
}
