import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { clampMin } from '@/graph/math';
import { type Node } from '@/stores';

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
    this.mouseStyle.lock(style);
    this.mousePoint.x = e.x;
    this.mousePoint.y = e.y;
    const key = el.getAttribute('data-graph-item-id');
    const node = this.graph.nodesMap.get(key);
    Object.assign(this.oldNode, node);
  }

  onmousemove(e: MouseEvent) {
    if (this.isPressed) {
      const dx = e.x - this.mousePoint.x;
      const dy = e.y - this.mousePoint.y;
      const node = this.graph.nodesMap.get(this.oldNode.id);
      this.changeSize(dx, dy, node);
    }
  }

  onmouseup(e: MouseEvent) {
    if (this.isPressed) {
      this.isPressed = false;
      const node = this.graph.nodesMap.get(this.oldNode.id);
      // if (this.project.value.collides(node).length === 0 && this.project.value.correctOrderOfNode(node)) {
      node.w = Math.round(node.w);
      node.h = Math.round(node.h);
      node.x = Math.round(node.x);
      node.y = Math.round(node.y);
      //   emitter.emit('node:update', node);
      // } else {
      //   node.w = this.oldNode.w;
      //   node.h = this.oldNode.h;
      //   node.x = this.oldNode.x;
      //   node.y = this.oldNode.y;
      // }
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }

  private changeSize(dx: number, dy: number, node: Node) {
    const dtW = dx / this.graph.cardWidth;
    const dtH = dy / this.graph.cardHeight;
    const rw = clampMin(this.oldNode.w + dtW, 1);
    const lw = clampMin(this.oldNode.w - dtW, 1);
    const bh = clampMin(this.oldNode.h + dtH, 1);
    const th = clampMin(this.oldNode.h - dtH, 1);
    const x = this.oldNode.x + (lw === 1 ? this.oldNode.w - 1 : dtW);
    const y = this.oldNode.y + (th === 1 ? this.oldNode.h - 1 : dtH);

    switch (this.direction) {
      case 'l':
        node.w = lw;
        node.x = x;
        break;
      case 'r':
        node.w = rw;
        break;
      case 't':
        node.h = th;
        node.y = y;
        break;
      case 'b':
        node.h = bh;
        break;
      case 'lt':
        node.w = lw;
        node.h = th;
        node.x = x;
        node.y = y;
        break;
      case 'rb':
        node.w = rw;
        node.h = bh;
        break;
      case 'rt':
        node.w = rw;
        node.h = th;
        node.y = y;
        break;
      case 'lb':
        node.w = lw;
        node.h = bh;
        node.x = x;
        break;
      default:
        break;
    }
  }
}
