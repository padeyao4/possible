import G6 from '@antv/g6'
import { trim } from 'lodash'

const stateMapper = {
  completed: '#bdbbbb',
  normal: '#70bffa',
  timeout: '#c74e4e',
  discard: '#7d849560'
}

function warpText(text: string) {
  if (text.length > 7) {
    return trim(text.slice(0, 7) + '\n' + text.slice(7, 14) + (text.length > 14 ? '..' : ''))
  } else {
    return trim(text)
  }
}

G6.registerNode(
  'task-node',
  {
    draw(cfg, group) {
      const keyShape = group.addShape('rect', {
        attrs: {
          x: -50,
          y: -20,
          width: cfg.width as number,
          height: cfg.height as number,
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
          lineWidth: 0,
          textBaseline: 'middle',
          textAlign: 'center',
          text: warpText(cfg.name as string),
          fontSize: 12
        },
        draggable: true
      })
      return keyShape
    },
    update: undefined
  },
  'rect'
)
