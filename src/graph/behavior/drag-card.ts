import {
  BaseBehavior,
  GRAPH_ITEM_ID,
  GRAPH_NODE_ANCHOR,
  GRAPH_NODE_RESIZE_REGION,
  type GraphEventType,
  type CanvasEvent
} from '@/graph';
import { CARD_HEIGHT, CARD_WIDTH, type Plan } from '@/stores';
import type { Ref } from 'vue';

export class DragCard extends BaseBehavior {
  down = false;
  mousePosition = { x: 0, y: 0 };
  oldNode = {} as Plan;
  project: Plan;

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

  constructor(container: Ref<Element>, project: Plan) {
    super(container, project);
    this.project = project;
  }

  onmousedown(e: MouseEvent, el: Element) {
    if (
      this.down ||
      e.button !== 0 ||
      el.hasAttribute(GRAPH_NODE_RESIZE_REGION) ||
      el.hasAttribute(GRAPH_NODE_ANCHOR)
    )
      return;
    const id = el.getAttribute(GRAPH_ITEM_ID);
    const node = this.planStore.getPlan(id!);
    Object.assign(this.oldNode, node);
    this.down = true;
    this.mousePosition.x = e.x;
    this.mousePosition.y = e.y;
  }

  onmousemove(e: MouseEvent) {
    if (!this.down) return;
    const dx = e.x - this.mousePosition.x;
    const dy = e.y - this.mousePosition.y;
    const node = this.planStore.getPlan(this.oldNode.id!);

    node!.x = this.oldNode.x! + dx / CARD_WIDTH;
    node!.y = this.oldNode.y! + dy / CARD_HEIGHT;
    this.mouseStyle.lock('move');
  }

  onmouseup() {
    if (this.down) {
      this.down = false;
      const node = this.planStore.getPlan(this.oldNode.id!);
      node!.x = Math.round(node!.x!);
      node!.y = Math.max(Math.round(node!.y!), 0);
      this.mouseStyle.unlock();
    }
  }
}
