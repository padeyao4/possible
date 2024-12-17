import {
  BaseBehavior,
  GRAPH_ITEM_ID,
  GRAPH_NODE_RESIZE_REGION,
  MOUSE_STYLE,
  type CanvasEvent,
  type GraphEventType
} from '@/graph';
import { CARD_CONSTRAINTS, type Plan } from '@/stores';

export class ResizeCard extends BaseBehavior {
  handleEvent(evt: GraphEventType): void {
    const el = evt.element;
    switch (evt.type) {
      case 'mousedown':
        this.onmousedown(evt.event, el);
        break;
      case 'mousemove':
        this.onmousemove(evt.event);
        break;
      case 'mouseup':
        this.onmouseup();
        break;
    }
  }

  getEvents(): Set<CanvasEvent> {
    return new Set(['node:mousedown', ':mousemove', ':mouseup']);
  }

  down = false;
  mousePoint = { x: 0, y: 0 };
  oldNode = {} as any;
  direction = '';

  onmousedown(e: MouseEvent, el: Element) {
    if (this.down || e.button !== 0 || !el.hasAttribute(GRAPH_NODE_RESIZE_REGION)) return;
    this.down = true;
    this.direction = el.getAttribute(GRAPH_NODE_RESIZE_REGION)!;
    const style = el.getAttribute(MOUSE_STYLE) ?? 'defalut';
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

  onmouseup() {
    if (this.down) {
      this.down = false;
      const node = this.planStore.getPlan(this.oldNode.id!)!;
      node.width = Math.round(node.width!);
      node.height = Math.round(node.height!);
      node.x = Math.round(node.x!);
      node.y = Math.round(node.y!);
      this.mouseStyle.unlock();
    }
  }

  private resizeNode(dx: number, dy: number, node: Plan) {
    const deltaWidth = dx / CARD_CONSTRAINTS.GRID_WIDTH;
    const deltaHeight = dy / CARD_CONSTRAINTS.GRID_HEIGHT;

    // 计算新的宽高，不再应用约束
    const newWidth = {
      right: Math.max(1, this.oldNode.width! + deltaWidth),
      left: Math.max(1, this.oldNode.width! - deltaWidth)
    };

    const newHeight = {
      bottom: Math.max(1, this.oldNode.height! + deltaHeight),
      top: Math.max(1, this.oldNode.height! - deltaHeight)
    };

    // 计算新位置
    const newPosition = {
      x: this.oldNode.x + (this.direction.includes('l') ? this.oldNode.width! - newWidth.left : 0),
      y: this.oldNode.y + (this.direction.includes('t') ? this.oldNode.height! - newHeight.top : 0)
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

    const handler = resizeMap[this.direction as keyof typeof resizeMap];
    if (handler) {
      handler();
      this.emitResize(node);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitResize(node: Plan) {
    // 可以添加调整大小完成后的回调
    // 比如更新连接线、触发保存等
  }
}
