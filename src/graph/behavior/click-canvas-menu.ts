import { BaseBehavior, GRAPH_ITEM_ID, type GraphEventType, type CanvasEvent } from '@/graph';
import { emitter } from '@/utils';

export class ClickCanvasMenu extends BaseBehavior {
  handleEvent(evt: GraphEventType): void {
    if (evt.type === 'contextmenu' && evt.shape) {
      const itemId = evt.element.getAttribute(GRAPH_ITEM_ID)!;
      emitter.emit('open-canvas-menu', {
        menuType: evt.shape as 'canvas' | 'node' | 'edge',
        x: evt.event.x,
        y: evt.event.y,
        itemId
      });
    }
  }

  getEvents(): Set<CanvasEvent> {
    return new Set(['canvas:contextmenu', 'node:contextmenu', 'edge:contextmenu']);
  }
}
