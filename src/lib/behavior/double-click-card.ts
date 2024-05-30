import { BaseBehavior, type EventDispatch } from '@/lib/base'
import $bus from '../bus'

export class DoubleClickCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'node:dblclick': this.onclick.bind(this)
    }
  }

  onclick(e: MouseEvent, el: Element) {
    if (e.button !== 0) return
    $bus.emit('open-editor', {
      event: e,
      id: el.getAttribute('data-key'),
      shapeType: el.getAttribute('data-el-type')
    })
  }
}
