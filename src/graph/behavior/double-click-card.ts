import { BaseBehavior, type EventDispatch } from '@/graph/base';
import emitter from '../emitter';

export class DoubleClickCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'node:dblclick': this.onclick.bind(this)
    };
  }

  onclick(e: MouseEvent, el: Element) {
    if (e.button !== 0) return;
    emitter.emit('open-editor', {
      event: e,
      id: el.getAttribute('data-key'),
      shapeType: el.getAttribute('data-el-type')
    });
  }
}
