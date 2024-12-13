import { BaseBehavior, type EventDispatch } from '@/graph/base';

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

  onmousedown(e: MouseEvent) {
    if (this.isDown || e.button !== 0) return;
    this.isDown = true;
    this.position.x = e.x;
    this.position.y = e.y;
    const { x, y } = this.project;

    this.offset.x = x;
    this.offset.y = y;
    this.mouseStyle.lock('grabbing');
  }

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return;
    const dx = e.x - this.position.x;
    const dy = e.y - this.position.y;
    this.project.x = this.offset.x + dx;
    this.project.y = Math.min(this.offset.y + dy, 0);
  }

  onmouseup(e: MouseEvent) {
    if (this.isDown) {
      this.isDown = false;
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }
}
