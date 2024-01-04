import {
  type ComboDisplayModel,
  type ComboModelData,
  Extensions,
  type NodeDisplayModel,
  type NodeModelData
} from '@antv/g6'
import type { NodeShapeMap } from '@antv/g6/lib/types/node'
import type { ComboShapeMap } from '@antv/g6/lib/types/combo'
import type { State } from '@antv/g6/lib/types/item'

export class CreateNode extends Extensions.BaseBehavior {
  getEvents() {
    return {
      'canvas:dblclick': this.create
    }
  }

  create(e: any) {
    this.graph.addData('node', {
      id: `node+${Math.random()}`,
      data: {
        x: e.canvas.x,
        y: e.canvas.y
      }
    })
  }
}

export class CardNode extends Extensions.RectNode {
  drawOtherShapes(
    model: NodeDisplayModel | ComboDisplayModel,
    shapeMap: NodeShapeMap | ComboShapeMap,
    diffData?: {
      previous: NodeModelData | ComboModelData
      current: NodeModelData | ComboModelData
    },
    diffState?: { previous: State[]; current: State[] }
  ): { [p: string]: any } {
    return {
      main: this.upsertShape(
        'rect',
        'rect-shape',
        {
          x: 10,
          y: 10,
          width: 20,
          height: 20,
          fill: '#2b2',
          stroke: '#fbb',
          radius: 2,
          cursor: 'move'
        },
        {
          model,
          shapeMap,
          diffData,
          diffState
        }
      ),
      info: this.upsertShape(
        'text',
        'text-info',
        {
          x: 0,
          y: 0,
          text: model.id,
          fill: '#000',
          textAlign: 'start',
          textBaseline: 'middle',
          fontSize: 14,
          textOverflow: 'ellipsis',
          wordWrap: true,
          wordWrapWidth: 30,
          maxLines: 2
        },
        {
          model,
          shapeMap,
          diffData,
          diffState
        }
      )
    }
  }
}
