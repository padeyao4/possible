import { Extensions } from '@antv/g6'

export class CardNode extends Extensions.RectNode {
  drawOtherShapes(model, shapeMap, diffData, diffState) {
    const { data: { name } } = model
    return {
      ...{
        info: this.upsertShape(
          'text',
          'text-info',
          {
            x: 0,
            y: 0,
            text: name,
            fill: '#000',
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: 12,
            textOverflow: 'ellipsis',
            wordWrap: true,
            wordWrapWidth: 32,
            maxLines: 2
          },
          {
            model,
            shapeMap,
            diffData,
            diffState
          }
        )
      },
      ...shapeMap
    }
  }
}
