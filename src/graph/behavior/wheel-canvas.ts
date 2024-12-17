import { BaseBehavior, type GraphEventType, type CanvasEvent } from '@/graph';

export class WheelCanvas extends BaseBehavior {
  handleEvent(evt: GraphEventType): void {
    if (evt.type === 'wheel') {
      this.onWheel(evt.event as unknown as WheelEvent);
    }
  }

  getEvents(): Set<CanvasEvent> {
    return new Set([':wheel']);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onWheel(_e: WheelEvent) {
    // this.project.y = Math.min(this.project.y - e.deltaY * 0.3, 0);
  }
}
