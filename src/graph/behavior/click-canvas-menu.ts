import { BaseBehavior, type EventDispatch } from '@/graph/base';
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
    const itemId = menuType === 'node' && (<HTMLElement>e.target).getAttribute('data-item-id');

    emitter.emit('open-canvas-menu', {
      menuType: menuType,
      x: e.x,
      y: e.y,
      itemId
    });
  }
}
