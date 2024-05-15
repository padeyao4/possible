import { BaseBehavior, type EventDispatch } from '@/lib/base'

export class DefaultBehavior extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      ':mouseover': this.toggleMouseOver.bind(this)
    }
  }
}