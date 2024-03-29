import { Extensions } from '@antv/g6'

export default class CardNode extends Extensions.RectNode {
  /**
   * 自定义text-label,解决label绘制不同步问题
   */
  drawOtherShapes(model: any, shapeMap: any, diffData: any, diffState: any) {
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
        wordWrapWidth: 60,
        maxLines: 2
      }, cfg), ...shapeMap
    }
  }
}
