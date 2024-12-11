import {
  BaseBehavior,
  type EventDispatch,
  GRAPH_ITEM_ID,
  GRAPH_NODE_ANCHOR,
  GRAPH_NODE_RESIZE_REGION
} from '@/graph/base'
import type { Node } from '@/stores'

export class DragCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'node:mousedown': this.onmousedown.bind(this),
      ':mouseup': this.onmouseup.bind(this),
      ':mousemove': this.onmousemove.bind(this)
    };
  }

  down = false;
  mousePosition = { x: 0, y: 0 };
  oldNode = <Node>{};

  onmousedown(e: MouseEvent, el: Element) {
    if (
      this.down ||
      e.button !== 0 ||
      el.hasAttribute(GRAPH_NODE_RESIZE_REGION) ||
      el.hasAttribute(GRAPH_NODE_ANCHOR)
    )
      return;
    // todo 判断是否为可拖拽节点
    const id = el.getAttribute(GRAPH_ITEM_ID)
    const node = this.graph.nodesMap.get(id);
    Object.assign(this.oldNode, node);
    this.down = true;
    this.mousePosition.x = e.x;
    this.mousePosition.y = e.y;
  }

  onmousemove(e: MouseEvent) {
    if (!this.down) return;
    const dx = e.x - this.mousePosition.x;
    const dy = e.y - this.mousePosition.y;
    const node = this.graph.nodesMap.get(this.oldNode.id);

    node.x = this.oldNode.x + dx / this.graph.cardWidth;
    node.y = this.oldNode.y + dy / this.graph.cardHeight;
    this.mouseStyle.lock('move');
  }

  onmouseup(e: MouseEvent) {
    if (this.down) {
      this.down = false;
      const node = this.graph.nodesMap.get(this.oldNode.id);
      node.x = Math.round(node.x);
      node.y = Math.max(Math.round(node.y), 0);
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }
}
