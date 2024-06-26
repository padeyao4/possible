import { BaseBehavior, type EventDispatch } from '@/graph/base';

export class DefaultBehavior extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      ':mouseover': this.toggleMouseOver.bind(this),
      ':mouseout': this.toggleMouseOut.bind(this)
    };
  }
}
