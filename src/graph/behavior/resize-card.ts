import {
  BaseBehavior,
  type EventDispatch,
  GRAPH_ITEM_ID,
  GRAPH_NODE_RESIZE_REGION,
  MOUSE_STYLE
} from '@/graph/base';
import { type Node } from '@/stores';

export class ResizeCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'node:mousedown': this.onmousedown.bind(this),
      ':mousemove': this.onmousemove.bind(this),
      ':mouseup': this.onmouseup.bind(this)
    };
  }

  down = false;
  mousePoint = { x: 0, y: 0 };
  oldNode = {} as any;
  direction = '';

  onmousedown(e: MouseEvent, el: Element) {
    if (this.down || e.button !== 0 || !el.hasAttribute(GRAPH_NODE_RESIZE_REGION)) return;
    this.down = true;
    this.direction = el.getAttribute(GRAPH_NODE_RESIZE_REGION);
    const style = el.getAttribute(MOUSE_STYLE);
    this.mouseStyle.lock(style);
    this.mousePoint.x = e.x;
    this.mousePoint.y = e.y;
    const node = this.graph.nodesMap.get(el.getAttribute(GRAPH_ITEM_ID));
    Object.assign(this.oldNode, node);
  }

  onmousemove(e: MouseEvent) {
    if (this.down) {
      const dx = e.x - this.mousePoint.x;
      const dy = e.y - this.mousePoint.y;
      const node = this.graph.nodesMap.get(this.oldNode.id);
      this.changeSize(dx, dy, node);
    }
  }

  onmouseup(e: MouseEvent) {
    if (this.down) {
      this.down = false;
      const node = this.graph.nodesMap.get(this.oldNode.id);
      node.w = Math.round(node.w);
      node.h = Math.round(node.h);
      node.x = Math.round(node.x);
      node.y = Math.round(node.y);
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }

  private changeSize(dx: number, dy: number, node: Node) {
    const dtW = dx / this.graph.cardWidth;
    const dtH = dy / this.graph.cardHeight;
    const rw = Math.max(this.oldNode.w + dtW, 1);
    const lw = Math.max(this.oldNode.w - dtW, 1);
    const bh = Math.max(this.oldNode.h + dtH, 1);
    const th = Math.max(this.oldNode.h - dtH, 1);
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
