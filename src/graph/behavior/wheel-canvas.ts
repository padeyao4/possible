import { BaseBehavior, type EventDispatch } from '@/graph/base';

export class WheelCanvas extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      ':wheel': (e: PointerEvent) => this.onWheel(e as unknown as WheelEvent)
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onWheel(_e: WheelEvent) {
    // this.project.y = Math.min(this.project.y - e.deltaY * 0.3, 0);
  }
}
