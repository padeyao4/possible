import { BaseBehavior, GRAPH_ITEM_ID, type GraphEventType, type CanvasEvent } from '@/graph';
import { emitter } from '@/utils';

interface ClickState {
  down: boolean;
  start: { x: number; y: number };
  lastClickTime: number;
  clickCount: number;
  clickTimer: number | null;
}

export class ClickCard extends BaseBehavior {
  private readonly DOUBLE_CLICK_DELAY = 200; // 双击判定时间间隔(毫秒)
  private readonly CLICK_DISTANCE = 25; // 点击有效距离
  
  private state: ClickState = {
    down: false,
    start: { x: 0, y: 0 },
    lastClickTime: 0,
    clickCount: 0,
    clickTimer: null
  };

  handleEvent(evt: GraphEventType): void {
    switch (evt.type) {
      case 'mousedown':
        this.onMouseDown(evt.event);
        break;
      case 'mouseup':
        this.onMouseUp(evt.event, evt.element);
        break;
    }
  }

  getEvents(): Set<CanvasEvent> {
    return new Set(['node:mousedown', ':mouseup']);
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    this.state.down = true;
    this.state.start = { x: e.offsetX, y: e.offsetY };
  }

  private onMouseUp(e: MouseEvent, el: Element) {
    if (!this.state.down) return;
    this.state.down = false;

    // 计算点击距离
    const distance = Math.sqrt(
      (e.offsetX - this.state.start.x) ** 2 + 
      (e.offsetY - this.state.start.y) ** 2
    );

    // 如果移动距离太大，不算作点击
    if (distance > this.CLICK_DISTANCE) return;

    const currentTime = Date.now();
    const timeDiff = currentTime - this.state.lastClickTime;

    if (timeDiff < this.DOUBLE_CLICK_DELAY) {
      // 清除单击定时器
      if (this.state.clickTimer) {
        window.clearTimeout(this.state.clickTimer);
        this.state.clickTimer = null;
      }
      
      // 处理双击：切换节点展开/收起状态
      const node = this.planStore.getPlan(el.getAttribute(GRAPH_ITEM_ID)!);
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
      
      this.state.clickCount = 0;
    } else {
      // 使用定时器延迟处理单击事件
      this.state.clickTimer = window.setTimeout(() => {
        emitter.emit('open-editor', {
          id: el.getAttribute(GRAPH_ITEM_ID)!
        });
        this.state.clickTimer = null;
      }, this.DOUBLE_CLICK_DELAY);
    }

    this.state.lastClickTime = currentTime;
  }
}
