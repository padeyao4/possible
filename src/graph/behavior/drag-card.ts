import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { clampMin } from '../math';
import type { Point } from '@/core/types';
import type { Node } from '@/core/Node';
import { emitter } from '@/utils';
import { inject, type Ref } from 'vue'
import { type Project, useGraph } from '@/stores'

export class DragCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'node:mousedown': this.onmousedown.bind(this),
      ':mouseup': this.onmouseup.bind(this),
      ':mousemove': this.onmousemove.bind(this)
    };
  }

  graph = useGraph()
  project = inject<Ref<Project>>('project')
  isDown = false;
  mousePosition: Point = { x: 0, y: 0 };
  oldNode = {} as Node;

  onmousedown(e: MouseEvent, el: Element) {
    if (this.isDown || e.button !== 0) return;
    const nodeId = el.getAttribute('data-key');
    // const node = this.project.value.nodeMap.get(nodeId);
    const node = this.graph.nodesMap.get(nodeId);
    Object.assign(this.oldNode, node);
    this.isDown = true;
    this.mousePosition.x = e.x;
    this.mousePosition.y = e.y;
  }

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return;
    const dx = e.x - this.mousePosition.x;
    const dy = e.y - this.mousePosition.y;
    // const node = this.project.value.nodeMap.get(this.oldNode.id);
    const node = this.graph.nodesMap.get(this.oldNode.id);

    node.x = this.oldNode.x + dx / this.graph.cardWidth;
    node.y = this.oldNode.y + dy / this.graph.cardHeight;
    this.mouseStyle.lock('move');
  }

  onmouseup(e: MouseEvent) {
    if (this.isDown) {
      this.isDown = false;
      // const node = this.project.value.nodeMap.get(this.oldNode.id);
      const node = this.graph.nodesMap.get(this.oldNode.id);
      node.x = clampMin(Math.round(node.x), 0);
      node.y = clampMin(Math.round(node.y), 0);

      // if (this.project.value.collides(node).length !== 0 || !this.project.value.correctOrderOfNode(node)) {
      //   node.x = this.oldNode.x;
      //   node.y = this.oldNode.y;
      // } else {
        // emitter.emit('node:update', node);
        // todo
      // }
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
    }
  }
}
