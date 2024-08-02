import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { emitter } from '@/utils';

export class Contextmenu extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'canvas:contextmenu': (e) =>
        emitter.emit('contextmenu-canvas:open', { e, elementType: 'canvas' }),
      'node:contextmenu': (e) =>
        emitter.emit('contextmenu-canvas:open', { e, elementType: 'node' }),
      'edge:contextmenu': (e) => emitter.emit('contextmenu-canvas:open', { e, elementType: 'edge' })
    };
  }
}
