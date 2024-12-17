import { BaseBehavior, GRAPH_ITEM_ID, type EventDispatch } from '@/graph';
import { emitter } from '@/utils';

export class ClickCanvasMenu extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'canvas:contextmenu': (e) => this.handleEvent(<PointerEvent>e, 'canvas'),
      'node:contextmenu': (e) => this.handleEvent(<PointerEvent>e, 'node'),
      'edge:contextmenu': (e) => this.handleEvent(<PointerEvent>e, 'edge')
    };
  }

  handleEvent(e: PointerEvent, menuType: 'canvas' | 'node' | 'edge') {
    const itemId = (<HTMLElement>e.target).getAttribute(GRAPH_ITEM_ID)!;

    emitter.emit('open-canvas-menu', {
      menuType: menuType,
      x: e.x,
      y: e.y,
      itemId
    });
  }
}
