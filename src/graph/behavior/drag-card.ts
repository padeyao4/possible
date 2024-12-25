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

    const deltaX = dx / CARD_WIDTH;
    const deltaY = dy / CARD_HEIGHT;

    const node = this.planStore.getPlan(this.oldNode.id!);
    node!.x = this.oldNode.x! + deltaX;
    node!.y = this.oldNode.y! + deltaY;

    // 如果有父节点,检查是否超出父节点边界
    if (node!.parentId) {
      const parent = this.planStore.getPlan(node!.parentId);
      if (parent && parent.width && parent.height) {
        // 限制在父节点范围内
        node!.x = Math.max(0, Math.min(node!.x!, parent.width - node!.width!));
        node!.y = Math.max(0, Math.min(node!.y!, parent.height - node!.height!));
      }
    }

    this.mouseStyle.lock('move');
  }

  // 检查是否与其他节点重叠，考虑padding值
  checkOverlap(node1: any, node2: any, padding: number = 0.2) {
    return node1.x! + padding < node2.x! + node2.width! - padding &&
      node1.x! + node1.width! - padding > node2.x! + padding &&
      node1.y! + padding < node2.y! + node2.height! - padding &&
      node1.y! + node1.height! - padding > node2.y! + padding;
  }


  onmouseup() {
    if (!this.down) return;

    this.down = false;
    const node = this.planStore.getPlan(this.oldNode.id!);
    if (!node) return;

    // 检查前置节点约束
    const isValidPrevPosition = this.validatePrevNodesPosition(node);
    if (!isValidPrevPosition) {
      this.restoreOriginalPosition(node);
      return;
    }

    // 检查兄弟节点重叠
    const hasOverlap = this.checkSiblingNodeOverlap(node);
    if (hasOverlap) {
      this.restoreOriginalPosition(node);
    } else {
      this.normalizeNodePosition(node);
    }

    this.mouseStyle.unlock();
  }

  // 验证前置节点位置约束
  private validatePrevNodesPosition(node: any, padding: number = 0.2): boolean {
    if (!node.prevs || node.prevs.length === 0) return true;

    const prevNodes = node.prevs.map((prevId: string) => this.planStore.getPlan(prevId));
    return prevNodes.every(prevNode =>
      prevNode && node.x! + padding >= prevNode.x! + prevNode.width! - padding
    );
  }

  // 检查兄弟节点重叠
  private checkSiblingNodeOverlap(node: any): boolean {
    const siblingNodes = Array.from(this.planStore.plansMap.values())
      .filter(p => p.parentId === node.parentId && p.id !== node.id);

    return siblingNodes.some(sibling => this.checkOverlap(node, sibling));
  }

  // 恢复原始位置
  private restoreOriginalPosition(node: any) {
    node.x = this.oldNode.x;
    node.y = this.oldNode.y;
  }

  // 标准化节点位置
  private normalizeNodePosition(node: any) {
    node.x = Math.round(node.x!);
    node.y = Math.max(Math.round(node.y!), 0);
  }
}
