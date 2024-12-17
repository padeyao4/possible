/**
 * canvas卡片组件
 * data-graph-item-shape 属性表示graph中有哪些类型。node edge canvas
 * data-graph-item-id 属性表示节点id
 * data-graph-node-anchor 属性表示锚点类型。值可以为 left right
 * data-graph-node-resize-region 属性表示是否可以缩放。表示八个方向的调整方向
 * data-mouse-style 属性表示鼠标样式。值可以为 default pointer grab
 */

import { useCursor } from '@/stores/cursor';
import { useEventListener } from '@vueuse/core';
import type { Ref } from 'vue';
import { CARD_HEIGHT, CARD_WIDTH, usePlanStore, type Plan } from '@/stores';

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

export type GraphEventType = {
  type: EventType;
  shape: GraphShape;
  event: PointerEvent;
  element: Element;
};

export interface IBehavior {
  // 初始化行为
  init?(): void;
  // 清理行为
  destroy?(): void;
  // 处理事件
  handleEvent(evt: GraphEventType): void;
  // 获取此行为关注的事件类型
  getEvents(): Set<CanvasEvent>;
}

export abstract class BaseBehavior implements IBehavior {
  protected mouseStyle = useCursor();
  protected planStore = usePlanStore();
  protected project: Plan;
  protected container: Ref<Element>;

  constructor(container: Ref<Element>, project: Plan) {
    this.container = container;
    this.project = project;
  }

  // 添加 init 方法的声明
  init?(): void {}

  // 添加 destroy 方法声明
  destroy?(): void {}

  // 获取画布坐标
  protected getCanvasPositionByEvent(e: PointerEvent) {
    const bound = this.container.value.getBoundingClientRect();
    return {
      x: Math.floor((e.x - bound.left - this.project.x!) / CARD_WIDTH),
      y: Math.floor((e.y - bound.top - this.project.y!) / CARD_HEIGHT)
    };
  }

  // 获取实际坐标
  protected getClientPositionByEvent(e: MouseEvent) {
    const bound = this.container.value.getBoundingClientRect();
    return {
      x: e.x - bound.left - this.project.offsetX!,
      y: e.y - bound.top - this.project.offsetY!
    };
  }

  abstract handleEvent(evt: GraphEventType): void;
  abstract getEvents(): Set<CanvasEvent>;
}

export class Register {
  private behaviors: BaseBehavior[] = [];
  private eventMap = new Map<CanvasEvent, BaseBehavior[]>();
  private container: Ref<Element>;
  private project: Plan;
  private cleanup?: () => void;

  constructor(container: Ref<Element>, project: Plan) {
    this.container = container;
    this.project = project;
  }

  public addBehaviors(...behaviors: (new (container: Ref<Element>, project: Plan) => BaseBehavior)[]) {
    behaviors.forEach((Behavior) => {
      const behavior = new Behavior(this.container, this.project);
      this.behaviors.push(behavior);
      
      // 注册行为事件
      behavior.getEvents().forEach(eventType => {
        if (!this.eventMap.has(eventType)) {
          this.eventMap.set(eventType, []);
        }
        this.eventMap.get(eventType)!.push(behavior);
      });
      
      // 调用初始化
      behavior.init?.();
    });
  }

  public listen() {
    // 监听所有鼠标事件
    eventTypes.forEach(type => {
      this.container.value.addEventListener(type, this.handleEvent.bind(this), {
        passive: true
      });
    });

    // 全局鼠标抬起事件
    this.cleanup = useEventListener(
      document,
      'mouseup',
      this.handleEvent.bind(this)
    );
  }

  public destroy() {
    // 移除事件监听
    eventTypes.forEach(type => {
      this.container.value?.removeEventListener(type, this.handleEvent);
    });
    this.cleanup?.();

    // 清理行为
    this.behaviors.forEach(behavior => behavior.destroy?.());
    
    // 清空数据
    this.behaviors = [];
    this.eventMap.clear();
  }

  private handleEvent(e: Event) {
    const event = e as PointerEvent;
    const element = event.target as Element;
    const shape = element.getAttribute(GRAPH_ITEM_SHAPE) as GraphShape ?? '';
    const eventType = `${shape}:${event.type}` as CanvasEvent;

    // 构造事件对象
    const graphEvent: GraphEventType = {
      type: event.type as EventType,
      shape,
      event,
      element
    };

    // 触发对应的行为处理器
    this.eventMap.get(eventType)?.forEach(behavior => {
      behavior.handleEvent(graphEvent);
    });

    // 触发全局事件处理器
    this.eventMap.get(`:${event.type}` as CanvasEvent)?.forEach(behavior => {
      behavior.handleEvent(graphEvent);
    });
  }
}
