import { BaseBehavior, type EventDispatch } from '@/graph/base';
import emitter, { BusEvents } from '@/graph/emitter';

export class Contextmenu extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'canvas:contextmenu': (e) =>
        emitter.emit(BusEvents['graph:contextmenu'], { e, elementType: 'canvas' }),
      'node:contextmenu': (e) =>
        emitter.emit(BusEvents['graph:contextmenu'], { e, elementType: 'node' }),
      'edge:contextmenu': (e) =>
        emitter.emit(BusEvents['graph:contextmenu'], { e, elementType: 'edge' })
    };
  }
}
