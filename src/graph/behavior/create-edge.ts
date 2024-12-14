import {
  BaseBehavior,
  type EventDispatch,
  GRAPH_ITEM_ID,
  GRAPH_ITEM_SHAPE,
  GRAPH_NODE_ANCHOR
} from '@/graph';
import type { Edge } from '@/openapi';
import type { TempEdge } from '@/stores';
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
    const nodeId = el.getAttribute(GRAPH_ITEM_ID);
    const direction = el.getAttribute(GRAPH_NODE_ANCHOR);

    const { x, y } = this.getNumbersByEvent(e);

    const source = direction === 'source' ? nodeId : { x, y };
    const target = direction === 'target' ? nodeId : { x, y };

    this.graph.tempEdge = reactive({
      id: v4(),
      projectId: this.project.id,
      source,
      target
    } as TempEdge);

    this.mouseStyle.lock('crosshair');
  }

  onmousemove(e: MouseEvent) {
    if (!this.down) return;
    const { x, y } = this.getNumbersByEvent(e);
    if (typeof this.graph.tempEdge!.source === 'object') {
      this.graph.tempEdge!.source = { x, y };
    }
    if (typeof this.graph.tempEdge!.target === 'object') {
      this.graph.tempEdge!.target = { x, y };
    }
  }

  onmouseup(e: MouseEvent, el: Element) {
    if (!this.down) return;
    this.down = false;
    if (el.getAttribute(GRAPH_ITEM_SHAPE) === 'node') {
      const nodeId = el.getAttribute(GRAPH_ITEM_ID);
      if (typeof this.graph.tempEdge!.source === 'object') {
        this.graph.tempEdge!.source = nodeId!;
      } else {
        this.graph.tempEdge!.target = nodeId!;
      }

      // 如果起点和终点相同，则删除
      this.graph.tempEdge!.source === this.graph.tempEdge!.target && (this.graph.tempEdge = null);

      // 如果已存在该边，则删除
      this.graph.tempEdge &&
        Array.from(this.graph.edgesMap.values()).find(
          (edge) =>
            edge.source === this.graph.tempEdge!.source &&
            edge.target === this.graph.tempEdge!.target &&
            edge.id !== this.graph.tempEdge!.id
        ) &&
        (this.graph.tempEdge = null);

      // 如果存在临时边，则添加到edgesMap中
      this.graph.tempEdge !== null &&
        this.graph.addEdge({
          id: this.graph.tempEdge!.id,
          source: this.graph.tempEdge!.source,
          target: this.graph.tempEdge!.target,
          projectId: this.graph.tempEdge!.projectId
        } as Edge);
    }
    this.graph.tempEdge = null;
    this.mouseStyle.unlock();
    this.toggleMouseOver(e);
  }
}
