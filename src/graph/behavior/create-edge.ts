import {
  BaseBehavior,
  GRAPH_ITEM_ID,
  GRAPH_ITEM_SHAPE,
  GRAPH_NODE_ANCHOR,
  type GraphEventType,
  type CanvasEvent
} from '@/graph';
import { v4 } from 'uuid';
import { reactive } from 'vue';

export class CreateEdge extends BaseBehavior {
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
        this.onmouseup(evt.event, el);
        break;
    }
  }

  getEvents(): Set<CanvasEvent> {
    return new Set(['node:mousedown', ':mousemove', ':mouseup']);
  }

  down = false;

  onmousedown(e: PointerEvent, el: Element) {
    if (e.button !== 0) return;
    if (!el.hasAttribute(GRAPH_NODE_ANCHOR)) return;
    this.down = true;
    const nodeId = el.getAttribute(GRAPH_ITEM_ID)!;
    const direction = el.getAttribute(GRAPH_NODE_ANCHOR);

    const { x, y } = this.getClientPositionByEvent(e);

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
    const { x, y } = this.getClientPositionByEvent(e);
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
        const from = this.planStore.getPlan(this.planStore.tempPath!.fromId!)!
        const to = this.planStore.getPlan(this.planStore.tempPath!.toId!)!
        if (from.parentId === to.parentId) {
          this.planStore.addRelation(this.planStore.tempPath!.fromId!, this.planStore.tempPath!.toId!);
        }
      }
    }
    this.planStore.tempPath = null;
    this.mouseStyle.unlock();
  }
}
