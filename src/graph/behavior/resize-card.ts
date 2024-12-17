import {
  BaseBehavior,
  type EventDispatch,
  GRAPH_ITEM_ID,
  GRAPH_NODE_RESIZE_REGION,
  MOUSE_STYLE
} from '@/graph/base';
import { CARD_HEIGHT, CARD_WIDTH, type Plan } from '@/stores';

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
    this.direction = el.getAttribute(GRAPH_NODE_RESIZE_REGION)!;
    const style = el.getAttribute(MOUSE_STYLE)??'defalut';
    this.mouseStyle.lock(style);
    this.mousePoint.x = e.x;
    this.mousePoint.y = e.y;
    const node = this.planStore.getPlan(el.getAttribute(GRAPH_ITEM_ID)!);
    Object.assign(this.oldNode, node);
  }

  onmousemove(e: MouseEvent) {
    if (this.down) {
      const dx = e.x - this.mousePoint.x;
      const dy = e.y - this.mousePoint.y;
      const node = this.planStore.getPlan(this.oldNode.id!)!;
      this.resizeNode(dx, dy, node);
    }
  }

  onmouseup(e: MouseEvent) {
    if (this.down) {
      this.down = false;
      const node = this.planStore.getPlan(this.oldNode.id!)!;
      node.width = Math.round(node.width!);
      node.height = Math.round(node.height!);
      node.x = Math.round(node.x!);
      node.y = Math.round(node.y!);
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }

  private resizeNode(dx: number, dy: number, node: Plan) {
    // 计算宽高变化量
    const deltaWidth = dx / CARD_WIDTH;
    const deltaHeight = dy / CARD_HEIGHT;

    // 计算新的宽高
    const newWidth = {
      right: Math.max(this.oldNode.width! + deltaWidth, 1),
      left: Math.max(this.oldNode.width! - deltaWidth, 1)
    };
    const newHeight = {
      bottom: Math.max(this.oldNode.height! + deltaHeight, 1),
      top: Math.max(this.oldNode.height! - deltaHeight, 1)
    };

    // 计算新的位置
    const newPosition = {
      x: this.oldNode.x + (newWidth.left === 1 ? this.oldNode.width! - 1 : deltaWidth),
      y: this.oldNode.y + (newHeight.top === 1 ? this.oldNode.height! - 1 : deltaHeight)
    };

    // 根据拖拽方向更新节点属性
    const resizeMap = {
      l: () => {
        node.width = newWidth.left;
        node.x = newPosition.x;
      },
      r: () => {
        node.width = newWidth.right;
      },
      t: () => {
        node.height = newHeight.top;
        node.y = newPosition.y;
      },
      b: () => {
        node.height = newHeight.bottom;
      },
      lt: () => {
        node.width = newWidth.left;
        node.height = newHeight.top;
        node.x = newPosition.x;
        node.y = newPosition.y;
      },
      rb: () => {
        node.width = newWidth.right;
        node.height = newHeight.bottom;
      },
      rt: () => {
        node.width = newWidth.right;
        node.height = newHeight.top;
        node.y = newPosition.y;
      },
      lb: () => {
        node.width = newWidth.left;
        node.height = newHeight.bottom;
        node.x = newPosition.x;
      }
    };

    resizeMap[this.direction as keyof typeof resizeMap]?.();
  }
}
