import { BaseBehavior, GRAPH_ITEM_ID, type GraphEventType, type CanvasEvent } from '@/graph';
import { emitter } from '@/utils';

export class ClickCard extends BaseBehavior {
  handleEvent(evt: GraphEventType): void {
    switch (evt.type) {
      case 'mousedown':
        this.onMouseDown(evt.event);
        break;
      case 'mouseup':
        this.onMouseUp(evt.event, evt.element);
        break;
    }
  }

  getEvents(): Set<CanvasEvent> {
    return new Set(['node:mousedown', ':mouseup']);
  }

  distance = 100;
  start = { x: 0, y: 0 };
  down = false;

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
