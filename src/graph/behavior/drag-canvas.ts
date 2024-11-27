import { clampMax } from '@/graph/math';
import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { inject, type Ref } from 'vue';
import type { Project } from '@/stores';

export class DragCanvas extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'canvas:mousedown': this.onmousedown.bind(this),
      ':mousemove': this.onmousemove.bind(this),
      ':mouseup': this.onmouseup.bind(this)
    };
  }

  isDown = false;
  position = { x: 0, y: 0 };
  offset = { x: 0, y: 0 };
  project = inject<Ref<Project>>('project');

  onmousedown(e: MouseEvent) {
    if (this.isDown || e.button !== 0) return;
    this.isDown = true;
    this.position.x = e.x;
    this.position.y = e.y;
    const { x, y } = this.project.value;

    this.offset.x = x;
    this.offset.y = y;
    this.mouseStyle.lock('grabbing');
  }

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return;
    const dx = e.x - this.position.x;
    const dy = e.y - this.position.y;
    this.project.value.x = clampMax(this.offset.x + dx, 0);
    this.project.value.y = clampMax(this.offset.y + dy, 0);
  }

  onmouseup(e: MouseEvent) {
    if (this.isDown) {
      this.isDown = false;
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }
}
