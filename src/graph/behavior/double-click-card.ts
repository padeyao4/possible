import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { emitter } from '@/utils';

export class DoubleClickCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'node:dblclick': this.onclick.bind(this)
    };
  }

  onclick(e: MouseEvent, el: Element) {
    if (e.button !== 0) return;
    const node = this.project.getNode(el.getAttribute('data-key'));
    emitter.emit('editor-node:open', node);
  }
}
