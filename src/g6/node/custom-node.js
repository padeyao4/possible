import { Extensions } from '@antv/g6'

export class CardNode extends Extensions.RectNode {
  drawOtherShapes(model, shapeMap, diffData, diffState) {
    const { data: { name } } = model
    const cfg = {
      model, shapeMap, diffData, diffState
    }
    return {
      info: this.upsertShape('text', 'text-info', {
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
      }, cfg),
      ...shapeMap
    }
  }

  drawAnchorShapes(model, shapeMap, diffData, diffState) {
    const cfg = {
      model, shapeMap, diffData, diffState
    }
    return {
      'left-anchors': this.upsertShape('circle', 'left-dot', {
        visible: false,
        cx: -40,
        cy: 0,
        r: 4,
        fill: '#000',
        cursor: 'pointer'
      }, cfg),
      'right-anchors': this.upsertShape('circle', 'right-dot', {
        cx: 40,
        cy: 0,
        r: 4,
        fill: '#000',
        cursor: 'pointer'
      }, cfg)
      , ...shapeMap
    }
  }
}
