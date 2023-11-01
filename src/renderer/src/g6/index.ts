import G6, { BehaviorOption } from '@antv/g6'
import PossibleNodeDrag from './behavior/possibleNodeDrag'
import './layout/possibleLayout'
import './node/possibleNode'

const behaviors: Record<string, unknown> = {
  'possible-drag-node': PossibleNodeDrag
}

for (const key in behaviors) {
  G6.registerBehavior(key, <BehaviorOption>behaviors[key])
}
