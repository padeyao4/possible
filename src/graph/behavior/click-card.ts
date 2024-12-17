import { BaseBehavior, GRAPH_ITEM_ID, type EventDispatch } from '@/graph';
import { emitter } from '@/utils';

export class ClickCard extends BaseBehavior {
  distance = 100;
  start = { x: 0, y: 0 };
  down = false;

  getEventDispatch(): EventDispatch {
    return {
      'node:mousedown': this.onMouseDown.bind(this),
      ':mouseup': this.onMouseUp.bind(this)
    };
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    this.start = { x: e.offsetX, y: e.offsetY };
    this.down = true;
  }

  onMouseUp(e: MouseEvent, el: Element) {
    this.distance = Math.sqrt(e.offsetX - this.start.x) ** 2 + (e.offsetY - this.start.y) ** 2;
    if (this.distance <= 25 && this.down) {
      emitter.emit('open-editor', {
        id: el.getAttribute(GRAPH_ITEM_ID)!
      });
    }
    this.distance = 100;
    this.down = false;
  }
}
