import { BaseBehavior, type EventDispatch } from '@/lib/base';
import { clampMin } from '@/lib/math';
import Node from '@/core/Node';

export class ResizeCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'resize:mousedown': this.onmousedown.bind(this),
      ':mousemove': this.onmousemove.bind(this),
      ':mouseup': this.onmouseup.bind(this)
    };
  }

  isPressed = false;
  mousePoint = { x: 0, y: 0 };
  oldNode = {} as any;
  direction = '';

  onmousedown(e: MouseEvent, el: Element) {
    if (this.isPressed || e.button !== 0) return;

    this.isPressed = true;
    this.direction = el.getAttribute('data-direction');
    const style = el.getAttribute('data-mouse-style');
    this.mouseStyle.lockStyle(style);
    this.mousePoint.x = e.x;
    this.mousePoint.y = e.y;
    const key = el.getAttribute('data-key');
    const node = this.project.getNode(key);
    Object.assign(this.oldNode, node);
  }

  onmousemove(e: MouseEvent) {
    if (this.isPressed) {
      const dx = e.x - this.mousePoint.x;
      const dy = e.y - this.mousePoint.y;
      const node = this.project.getNode(this.oldNode.id);
      this.changeSize(dx, dy, node);
    }
  }

  onmouseup(e: MouseEvent) {
    if (this.isPressed) {
      this.isPressed = false;
      const node = this.project.getNode(this.oldNode.id);
      if (this.project.collides(node).length === 0) {
        node.width = Math.round(node.width);
        node.height = Math.round(node.height);
        node.x = Math.round(node.x);
        node.y = Math.round(node.y);
      } else {
        node.width = this.oldNode.width;
        node.height = this.oldNode.height;
        node.x = this.oldNode.x;
        node.y = this.oldNode.y;
      }
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }

  private changeSize(dx: number, dy: number, node: Node) {
    const deltaWidth = dx / this.settings.unitWidth;
    const deltaHeight = dy / this.settings.unitHeight;
    const rw = clampMin(this.oldNode.width + deltaWidth, 1);
    const lw = clampMin(this.oldNode.width - deltaWidth, 1);
    const bh = clampMin(this.oldNode.height + deltaHeight, 1);
    const th = clampMin(this.oldNode.height - deltaHeight, 1);
    const x = this.oldNode.x + (lw === 1 ? this.oldNode.width - 1 : deltaWidth);
    const y = this.oldNode.y + (th === 1 ? this.oldNode.height - 1 : deltaHeight);

    switch (this.direction) {
      case 'l':
        node.width = lw;
        node.x = x;
        break;
      case 'r':
        node.width = rw;
        break;
      case 't':
        node.height = th;
        node.y = y;
        break;
      case 'b':
        node.height = bh;
        break;
      case 'lt':
        node.width = lw;
        node.height = th;
        node.x = x;
        node.y = y;
        break;
      case 'rb':
        node.width = rw;
        node.height = bh;
        break;
      case 'rt':
        node.width = rw;
        node.height = th;
        node.y = y;
        break;
      case 'lb':
        node.width = lw;
        node.height = bh;
        node.x = x;
        break;
      default:
        break;
    }
  }
}
