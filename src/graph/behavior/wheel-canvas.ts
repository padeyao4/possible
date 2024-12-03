import { BaseBehavior, type EventDispatch } from '@/graph/base';

export class WheelCanvas extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      ':wheel': this.onWheel.bind(this)
    };
  }

  onWheel(e: WheelEvent) {
    this.project.y = Math.min(this.project.y - e.deltaY * 0.3, 0);
  }
}
