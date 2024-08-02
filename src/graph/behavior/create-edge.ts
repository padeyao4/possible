import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { type TempPath, useTempPaths } from '@/stores/temp-path';
import type { ID } from '@/core/types';
import { emitter } from '@/utils';
import { inject, type Ref } from 'vue';
import { Project } from '@/core';

export class CreateEdge extends BaseBehavior {
  isDown = false;
  source: string;
  target: string;
  tempPaths = useTempPaths();
  pathId: ID;
  project = inject<Ref<Project>>('project');

  getEventDispatch(): EventDispatch {
    return {
      'anchor:mousedown': this.onmousedown.bind(this),
      ':mousemove': this.onmousemove.bind(this),
      ':mouseup': this.onmouseup.bind(this)
    };
  }

  onmousedown(e: MouseEvent, el: Element) {
    if (e.button !== 0) return;
    if (el.hasAttribute('data-anchor')) {
      this.isDown = true;
      const key = el.getAttribute('data-key');
      const direction = el.getAttribute('data-anchor');
      const point = this.project.value.getPointByOffsetPoint({ x: e.offsetX, y: e.offsetY });
      const path = this.tempPaths.createTempPath(
        key,
        point,
        direction === 'left' ? 'target' : 'source'
      );
      this.pathId = path.id;
      this.mouseStyle.lock('crosshair');
    }
  }

  onmousemove(e: MouseEvent) {
    if (this.isDown) {
      this.updatePoint(e);
    }
  }

  private updatePoint(e: MouseEvent) {
    const point = this.project.value.getPointByOffsetPoint({ x: e.offsetX, y: e.offsetY });
    const path = this.tempPaths.getPath(this.pathId);
    path.location.x = point.x;
    path.location.y = point.y;
  }

  onmouseup(e: MouseEvent, el: Element, __, elType: string) {
    if (this.isDown) {
      const point = this.project.value.getPointByOffsetPoint({ x: e.offsetX, y: e.offsetY });
      const path = this.tempPaths.getPath(this.pathId);
      path.location.x = point.x;
      path.location.y = point.y;
      this.isDown = false;
      this.mouseStyle.unlock();
      this.toggleMouseOver(e);
      this.createEdge(el, elType, path);
      this.tempPaths.deletePath(this.pathId);
    }
  }

  private createEdge(el: Element, elType: string, path: TempPath) {
    if (elType === 'node' || elType === 'anchor') {
      const key = el.getAttribute('data-key');
      if (key == path.nodeId) return;
      path.opacity = 0;
      if (path.dummy === 'source') {
        if (!this.project.value.getEdge(path.nodeId, key)) {
          const edge = this.project.value.addEdge(path.nodeId, key);
          emitter.emit('edge:create', edge);
        }
      } else {
        if (!this.project.value.getEdge(key, path.nodeId)) {
          const edge = this.project.value.addEdge(key, path.nodeId);
          emitter.emit('edge:create', edge);
        }
      }
    }
  }
}
