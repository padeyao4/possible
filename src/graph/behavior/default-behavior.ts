import { BaseBehavior, type GraphEventType, type CanvasEvent, MOUSE_STYLE } from '@/graph';

export class DefaultBehavior extends BaseBehavior {
  handleEvent(evt: GraphEventType): void {
    switch (evt.type) {
      case 'mouseup':
        this.onMouseUp(evt);
        break;
      case 'mouseover':
        this.onMouseOver(evt);
        break;
      case 'mouseleave':
        this.onMouseLeave(evt);
        break
    }
  }

  onMouseUp(evt: GraphEventType) {
    const el = evt.element;
    const style = el.getAttribute(MOUSE_STYLE);
    this.mouseStyle.setWithUnlock(style ?? 'default');
  }

  onMouseOver(evt: GraphEventType) {
    const el = evt.element;
    const style = el.getAttribute(MOUSE_STYLE);
    this.mouseStyle.setWithUnlock(style ?? 'default');
  }

  onMouseLeave(evt: GraphEventType) {
    const el = evt.element;
    const style = el.getAttribute(MOUSE_STYLE);
    this.mouseStyle.setWithUnlock(style ?? 'default');
  }

  getEvents(): Set<CanvasEvent> {
    return new Set([':mouseup', ':mouseover', 'canvas:mouseleave']);
  }
}
