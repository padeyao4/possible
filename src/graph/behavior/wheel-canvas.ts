import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { clampMax } from '../math';

export class WheelCanvas extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      ':wheel': this.onWheel.bind(this)
    };
  }

  onWheel(e: WheelEvent) {
    this.project.y = clampMax(this.project.y - e.deltaY * 0.3, 0);
  }
}
