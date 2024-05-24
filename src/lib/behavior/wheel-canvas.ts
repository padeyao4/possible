import { BaseBehavior, type EventDispatch } from '@/lib/base';
import { clampMax } from '../math';

export default class WheelCanvas extends BaseBehavior {
    getEventDispatch(): EventDispatch {
        return {
            ':wheel': this.onWheel.bind(this)
        }
    }

    onWheel(e: WheelEvent) {
        this.project.offset.y = clampMax(this.project.offset.y - e.deltaY * 0.3, 0)
    }
}