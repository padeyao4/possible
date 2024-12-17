import { BaseBehavior, type EventDispatch } from '@/graph';
import type { Plan } from '@/stores';
import type { Ref } from 'vue';

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
  project: Plan;
  container: Ref<Element>;

  constructor(container: Ref<Element>, project: Plan) {
    super(container, project);
    this.project = project;
    this.container = container;
  }

  onmousedown(e: MouseEvent) {
    if (this.isDown || e.button !== 0) return;
    this.isDown = true;
    this.position.x = e.x;
    this.position.y = e.y;
    this.offset.x = this.project.offsetX!;
    this.offset.y = this.project.offsetY!;
    this.mouseStyle.lock('grabbing');
  }

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return;
    const dx = e.x - this.position.x;
    const dy = e.y - this.position.y;
    this.project.offsetX = this.offset.x + dx;
    this.project.offsetY = Math.min(this.offset.y + dy, 0);
  }

  onmouseup(e: MouseEvent) {
    if (this.isDown) {
      this.isDown = false;
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }
}
