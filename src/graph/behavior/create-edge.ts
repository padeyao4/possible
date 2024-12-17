import {
  BaseBehavior,
  type EventDispatch,
  GRAPH_ITEM_ID,
  GRAPH_ITEM_SHAPE,
  GRAPH_NODE_ANCHOR
} from '@/graph';
import { v4 } from 'uuid';
import { reactive } from 'vue';

export class CreateEdge extends BaseBehavior {
  down = false;

  getEventDispatch(): EventDispatch {
    return {
      'node:mousedown': this.onmousedown.bind(this),
      ':mousemove': this.onmousemove.bind(this),
      ':mouseup': this.onmouseup.bind(this)
    };
  }

  onmousedown(e: PointerEvent, el: Element) {
    if (e.button !== 0) return;
    if (!el.hasAttribute(GRAPH_NODE_ANCHOR)) return;
    this.down = true;
    const nodeId = el.getAttribute(GRAPH_ITEM_ID)!;
    const direction = el.getAttribute(GRAPH_NODE_ANCHOR);

    const { x, y } = this.getNumbersByEvent(e);

    if (direction === 'left') {
      this.planStore.tempPath = reactive({
        id: v4(),
        to: { x, y },
        ctls: [],
        fromId: nodeId,
      });
    } else {
      this.planStore.tempPath = reactive({
        id: v4(),
        from: { x, y },
        ctls: [],
        toId: nodeId,
      });
    }
    this.mouseStyle.lock('crosshair');
  }

  onmousemove(e: MouseEvent) {
    if (!this.down) return;
    const { x, y } = this.getNumbersByEvent(e);
    if (this.planStore.tempPath?.from) {
      this.planStore.tempPath!.from!.x = x;
      this.planStore.tempPath!.from!.y = y;
    } else {
      this.planStore.tempPath!.to!.x = x;
      this.planStore.tempPath!.to!.y = y;
    }
  }

  onmouseup(e: MouseEvent, el: Element) {
    if (!this.down) return;
    this.down = false;
    if (el.getAttribute(GRAPH_ITEM_SHAPE) === 'node') {
      const nodeId = el.getAttribute(GRAPH_ITEM_ID);

      if (this.planStore.tempPath?.fromId) {
        this.planStore.tempPath!.toId! = nodeId!;
      } else {
        this.planStore.tempPath!.fromId! = nodeId!;
      }

      if (this.planStore.tempPath?.fromId !== this.planStore.tempPath?.toId) {
        this.planStore.addRelation(this.planStore.tempPath!.fromId!, this.planStore.tempPath!.toId!);
      }
    }
    this.planStore.tempPath = null;
    this.mouseStyle.unlock();
    this.toggleMouseOver(e);
  }
}
