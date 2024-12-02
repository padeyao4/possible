/**
 * canvas卡片组件
 * data-graph-item-shape 属性表示graph中有哪些类型。node edge canvas
 * data-graph-item-id 属性表示节点id
 * data-graph-node-anchor 属性表示锚点类型。值可以为 left right top bottom
 * data-graph-node-resize-region 属性表示是否可以缩放。表示八个方向的调整方向
 * data-mouse-style 属性表示鼠标样式。值可以为 default pointer grab
 */

import { useCursor } from '@/stores/cursor';
import { useEventListener } from '@vueuse/core';
import type { Ref } from 'vue';
import { useGraph } from '@/stores';

export const GRAPH_ITEM_SHAPE = 'data-graph-item-shape';
export const GRAPH_ITEM_ID = 'data-graph-item-id';
export const GRAPH_NODE_ANCHOR = 'data-graph-node-anchor';
export const GRAPH_NODE_RESIZE_REGION = 'data-graph-node-resize-region';
export const MOUSE_STYLE = 'data-mouse-style';

const eventTypes = [
  'mouseover',
  'mouseout',
  'mousedown',
  'mouseup',
  'mousemove',
  'click',
  'dblclick',
  'contextmenu',
  'wheel'
];

export type EventType =
  | 'mouseover'
  | 'mouseout'
  | 'mousedown'
  | 'mouseup'
  | 'mousemove'
  | 'click'
  | 'dblclick'
  | 'contextmenu'
  | 'wheel';

/**
 * ''表示全局
 */
export type GraphShape = 'canvas' | 'node' | 'edge' | '';
export type CanvasEvent = `${GraphShape}:${EventType}`;

export type EventDispatch = {
  [key in CanvasEvent]?: (e: Event, el: Element, elType: string) => void;
};

export abstract class BaseBehavior {
  mouseStyle = useCursor();
  graph = useGraph();
  project = this.graph.project;
  container: Ref<Element>;

  constructor(container: Ref<Element>) {
    this.container = container;
  }

  /**
   * 根据事件获取坐标获取graph中的坐标
   * @param e
   */
  getPositionByEvent(e: MouseEvent) {
    const bound = this.container.value.getBoundingClientRect();
    const x = Math.floor((e.x - bound.left - this.project.x) / this.graph.cardWidth);
    const y = Math.floor((e.y - bound.top - this.project.y) / this.graph.cardHeight);
    return {
      x,
      y
    };
  }

  /**
   * 根据事件获取坐标获取graph画布中的坐标,没有取整数
   * @param e
   */
  getNumbersByEvent(e: MouseEvent) {
    const bound = this.container.value.getBoundingClientRect();
    const x = e.x - bound.left - this.project.x;
    const y = e.y - bound.top - this.project.y;
    return {
      x,
      y
    };
  }

  abstract getEventDispatch(): EventDispatch;

  toggleMouseOver(e: MouseEvent) {
    const el = e.target as Element;
    const type = el.getAttribute(MOUSE_STYLE);
    this.mouseStyle.setWithUnlock(type !== null ? type : 'default');
  }

  toggleMouseOut() {
    this.mouseStyle.setWithUnlock('default');
  }
}

export class Register {
  behaviors: BaseBehavior[];
  container: Ref<Element>;
  globalListenerCleanup: any;

  constructor(container: Ref<Element>) {
    this.behaviors = [];
    this.container = container;
  }

  public addBehaviors(...behaviors: (typeof BaseBehavior)[]) {
    behaviors.forEach((b) => {
      this.behaviors.push(Reflect.construct(b, [this.container]));
    });
  }

  public listen() {
    eventTypes.forEach((mouseType) => {
      this.container.value.addEventListener(mouseType, this.processEvent.bind(this), {
        passive: true
      });
    });
    this.globalListenerCleanup = useEventListener(
      document,
      'mouseup',
      this.processEvent.bind(this)
    );
  }

  public removeListen() {
    eventTypes.forEach((mouseType) => {
      this.container.value?.removeEventListener(mouseType, this.processEvent);
    });
    this.globalListenerCleanup();
  }

  private processEvent(e: Event) {
    const el = e.target as Element;
    const eventType = e.type as EventType;
    const elShape = el.getAttribute(GRAPH_ITEM_SHAPE) ?? 'unknown';
    this.behaviors
      .filter((behavior) => {
        const dispatch = behavior.getEventDispatch();
        const set = new Set(Object.keys(dispatch));
        return set.has(elShape + ':' + eventType) || set.has(':' + eventType);
      })
      .forEach((behavior) => {
        const dispatchEvent = behavior.getEventDispatch();
        dispatchEvent[elShape + ':' + eventType]?.(e, el, eventType, elShape);
        dispatchEvent[':' + eventType]?.(e, el, eventType, elShape);
      });
  }
}
