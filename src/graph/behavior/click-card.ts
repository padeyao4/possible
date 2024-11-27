import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { emitter } from '@/utils';

export class ClickCard extends BaseBehavior {
  distance = 100;
  start = { x: 0, y: 0 };
  isDown = false;

  getEventDispatch(): EventDispatch {
    return {
      'node:mousedown': this.onMouseDown.bind(this),
      ':mouseup': this.onMouseUp.bind(this)
    };
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    this.start = { x: e.offsetX, y: e.offsetY };
    this.isDown = true;
  }

  onMouseUp(e: MouseEvent, el: Element) {
    this.distance = Math.sqrt(e.offsetX - this.start.x) ** 2 + (e.offsetY - this.start.y) ** 2;
    if (this.distance <= 25 && this.isDown) {
      const node = this.graph.nodesMap.get(el.getAttribute('data-key'));
      emitter.emit('editor:open', { item: node, type: 'node' });
    }
    this.distance = 100;
    this.isDown = false;
  }
}
