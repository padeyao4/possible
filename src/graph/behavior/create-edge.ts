import { BaseBehavior, type EventDispatch } from '@/graph/base';
import { type TempPath, useTempPaths } from '@/stores/temp-path';
import type { ID } from '@/core/types';
import emitter, { BusEvents } from '@/utils/emitter';

export class CreateEdge extends BaseBehavior {
  isDown = false;
  source: string;
  target: string;
  tempPaths = useTempPaths();
  pathId: ID;

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
      const point = this.project.getPointByOffsetPoint({ x: e.offsetX, y: e.offsetY });
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
    const point = this.project.getPointByOffsetPoint({ x: e.offsetX, y: e.offsetY });
    const path = this.tempPaths.getPath(this.pathId);
    path.location.x = point.x;
    path.location.y = point.y;
  }

  onmouseup(e: MouseEvent, el: Element, __, elType: string) {
    if (this.isDown) {
      const point = this.project.getPointByOffsetPoint({ x: e.offsetX, y: e.offsetY });
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
        if (!this.project.getEdge(path.nodeId, key)) {
          this.project.addEdge(path.nodeId, key);
        }
      } else {
        if (!this.project.getEdge(key, path.nodeId)) {
          this.project.addEdge(key, path.nodeId);
        }
      }
      emitter.emit(BusEvents['edge:created']);
    }
  }
}
