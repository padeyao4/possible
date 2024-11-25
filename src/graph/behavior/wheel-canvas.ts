import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { clampMax } from '../math';
import { emitter } from '@/utils';
import { inject, type Ref } from 'vue'
import type { Project } from '@/stores'

export class WheelCanvas extends BaseBehavior {
  project = inject<Ref<Project>>('project')

  getEventDispatch(): EventDispatch {
    return {
      ':wheel': this.onWheel.bind(this)
    };
  }

  onWheel(e: WheelEvent) {
    this.project.value.y = clampMax(this.project.value.y - e.deltaY * 0.3, 0);
    emitter.emit('project:update', this.project.value);
  }
}
