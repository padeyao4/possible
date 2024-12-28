import {
  BaseBehavior,
  GRAPH_ITEM_ID,
  GRAPH_NODE_RESIZE_REGION,
  MOUSE_STYLE,
  type CanvasEvent,
  type GraphEventType
} from '@/graph';
import { CARD_CONSTRAINTS, type Plan } from '@/stores';

interface ResizeState {
  down: boolean;
  mousePoint: { x: number; y: number };
  orginNode: Plan;
  direction: string;
}

interface ResizePosition {
  width: { right: number; left: number };
  height: { bottom: number; top: number };
  position: { x: number; y: number };
}

export class ResizeCard extends BaseBehavior {
  private state: ResizeState = {
    down: false,
    mousePoint: { x: 0, y: 0 },
    orginNode: {} as Plan,
    direction: ''
  };

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

  private onmousedown(e: MouseEvent, el: Element) {
    if (this.state.down || e.button !== 0 || !el.hasAttribute(GRAPH_NODE_RESIZE_REGION)) return;

    this.state.down = true;
    this.state.direction = el.getAttribute(GRAPH_NODE_RESIZE_REGION)!;
    this.state.mousePoint = { x: e.x, y: e.y };

    const node = this.planStore.getPlan(el.getAttribute(GRAPH_ITEM_ID)!);
    Object.assign(this.state.orginNode, node);

    const style = el.getAttribute(MOUSE_STYLE) ?? 'default';
    this.mouseStyle.lock(style);
  }

  private onmousemove(e: MouseEvent) {
    if (!this.state.down) return;

    const dx = e.x - this.state.mousePoint.x;
    const dy = e.y - this.state.mousePoint.y;
    const node = this.planStore.getPlan(this.state.orginNode.id!)!;

    this.resizeNode(dx, dy, node);
  }

  private onmouseup() {
    if (!this.state.down) return;

    const node = this.planStore.getPlan(this.state.orginNode.id!)!;
    this.roundNodePositions(node);
    // 检查节点是否与其他节点重叠
    const isOverlapping = this.checkNodeOverlap(node);
    if (isOverlapping) {
      // 如果重叠，恢复原始节点状态
      const dx = node.x! - this.state.orginNode.x!;
      const dy = node.y! - this.state.orginNode.y!;
      Object.assign(node, this.state.orginNode);
      // 恢复子节点的相对坐标
      node.childrenIds?.forEach(childId => {
        const child = this.planStore.getPlan(childId)!;
        child.x! += dx;
        child.y! += dy;
      });
    }

    this.state.down = false;
    this.mouseStyle.unlock();
  }

  private checkNodeOverlap(node: Plan) {
    const otherNodes = Array.from(this.planStore.plansMap.values()).filter(n => n.id !== node.id && n.parentId === node.parentId);
    return otherNodes.some(other => {
      return node.x! < other.x! + other.width! && node.x! + node.width! > other.x! &&
        node.y! < other.y! + other.height! && node.y! + node.height! > other.y!;
    });
  }

  private roundNodePositions(node: Plan) {
    node.width = Math.round(node.width!);
    node.height = Math.round(node.height!);
    node.x = Math.round(node.x!);
    node.y = Math.round(node.y!);

    node.childrenIds?.forEach(childId => {
      const child = this.planStore.getPlan(childId)!;
      child.x = Math.round(child.x!);
      child.y = Math.round(child.y!);
    });
  }

  private calculateResizePosition(dx: number, dy: number): ResizePosition {
    const deltaWidth = dx / CARD_CONSTRAINTS.GRID_WIDTH;
    const deltaHeight = dy / CARD_CONSTRAINTS.GRID_HEIGHT;

    return {
      width: {
        right: Math.max(1, this.state.orginNode.width! + deltaWidth),
        left: Math.max(1, this.state.orginNode.width! - deltaWidth)
      },
      height: {
        bottom: Math.max(1, this.state.orginNode.height! + deltaHeight),
        top: Math.max(1, this.state.orginNode.height! - deltaHeight)
      },
      position: {
        x: this.state.orginNode.x! + (this.state.direction.includes('l') ? this.state.orginNode.width! - Math.max(1, this.state.orginNode.width! - deltaWidth) : 0),
        y: this.state.orginNode.y! + (this.state.direction.includes('t') ? this.state.orginNode.height! - Math.max(1, this.state.orginNode.height! - deltaHeight) : 0)
      }
    };
  }

  private getChildrenRelativePositions(node: Plan, originalX: number, originalY: number) {
    const positions = new Map<string, { x: number, y: number }>();

    node.childrenIds?.forEach(childId => {
      const child = this.planStore.getPlan(childId)!;
      positions.set(childId, {
        x: child.x! + originalX,
        y: child.y! + originalY
      });
    });

    return positions;
  }

  private updateChildrenPositions(node: Plan, relativePositions: Map<string, { x: number, y: number }>) {
    node.childrenIds?.forEach(childId => {
      const child = this.planStore.getPlan(childId)!;
      const relativePos = relativePositions.get(childId)!;
      child.x = relativePos.x - node.x!;
      child.y = relativePos.y - node.y!;
    });
  }

  private resizeNode(dx: number, dy: number, node: Plan) {
    const { width, height, position } = this.calculateResizePosition(dx, dy);
    const childrenPositions = this.getChildrenRelativePositions(node, node.x!, node.y!);
    const resizeHandlers = this.createResizeHandlers(node, width, height, position);
    const handler = resizeHandlers[this.state.direction as keyof typeof resizeHandlers];

    if (handler) {
      handler();

      // 计算子节点的边界框
      const bounds = node.childrenIds?.reduce((acc, childId) => {
        const child = this.planStore.getPlan(childId)!;
        const pos = childrenPositions.get(childId)!;
        return {
          minX: Math.min(acc.minX, pos.x),
          minY: Math.min(acc.minY, pos.y),
          maxX: Math.max(acc.maxX, pos.x + child.width!),
          maxY: Math.max(acc.maxY, pos.y + child.height!)
        };
      }, {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity
      });

      // 调整节点位置和大小以包含所有子节点
      if (bounds) {
        // 处理 x 坐标和宽度
        if (node.x! !== this.state.orginNode.x!) {
          node.x = Math.min(bounds.minX, node.x!);
          if (node.x! === bounds.minX) {
            node.width = this.state.orginNode.width! - (node.x! - this.state.orginNode.x!);
          }
        }

        // 处理 y 坐标和高度
        if (node.y! !== this.state.orginNode.y!) {
          node.y = Math.min(bounds.minY, node.y!);
          if (node.y! === bounds.minY) {
            node.height = this.state.orginNode.height! - (node.y! - this.state.orginNode.y!);
          }
        }

        // 确保节点大小足够容纳所有子节点
        if (node.width! !== this.state.orginNode.width!) {
          node.width = Math.max(bounds.maxX - node.x!, node.width!);
        }
        if (node.height! !== this.state.orginNode.height!) {
          node.height = Math.max(bounds.maxY - node.y!, node.height!);
        }
      }

      this.updateChildrenPositions(node, childrenPositions);
      this.emitResize();
    }
  }

  private createResizeHandlers(node: Plan, width: ResizePosition['width'], height: ResizePosition['height'], position: ResizePosition['position']) {
    const checkParentBounds = (bounds: { x?: number, y?: number, width?: number, height?: number }) => {
      if (!node.parentId) return true;

      const parent = this.planStore.getPlan(node.parentId);
      if (!parent?.width || !parent?.height) return true;

      const x = bounds.x ?? node.x!;
      const y = bounds.y ?? node.y!;
      const w = bounds.width ?? node.width!;
      const h = bounds.height ?? node.height!;

      return x >= 0 && y >= 0 && x + w <= parent.width && y + h <= parent.height;
    };

    return {
      l: () => this.applyResize(node, { width: width.left, x: position.x }, checkParentBounds),
      r: () => this.applyResize(node, { width: width.right }, checkParentBounds),
      t: () => this.applyResize(node, { height: height.top, y: position.y }, checkParentBounds),
      b: () => this.applyResize(node, { height: height.bottom }, checkParentBounds),
      lt: () => this.applyResize(node, { width: width.left, height: height.top, x: position.x, y: position.y }, checkParentBounds),
      rb: () => this.applyResize(node, { width: width.right, height: height.bottom }, checkParentBounds),
      rt: () => this.applyResize(node, { width: width.right, height: height.top, y: position.y }, checkParentBounds),
      lb: () => this.applyResize(node, { width: width.left, height: height.bottom, x: position.x }, checkParentBounds)
    };
  }

  private applyResize(node: Plan, changes: { width?: number; height?: number; x?: number; y?: number }, checkBounds: (bounds: any) => boolean) {
    if (!checkBounds(changes)) return;

    Object.entries(changes).forEach(([key, value]) => {
      if (value !== undefined) {
        (node as any)[key] = value;
      }
    });
  }

  private emitResize() {
    // 可以添加调整大小完成后的回调
    // 比如更新连接线、触发保存等
  }
}
