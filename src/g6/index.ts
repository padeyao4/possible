import G6, { BehaviorOption } from '@antv/g6'
import PossibleNodeDrag from './behavior/possible-node-drag'

const behaviors: Record<string, unknown> = {
  'possible-drag-node': PossibleNodeDrag
}

export function registerBehaviors() {
  for (const key in behaviors) {
    G6.registerBehavior(key, <BehaviorOption>behaviors[key])
  }
}
