import { useCursor } from '@/stores/cursor';
import { useSettings } from '@/stores/settings';
import { useEventListener } from '@vueuse/core';
import { Project } from '@/core';

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
export type ElementType = 'canvas' | 'node' | 'edge' | 'anchor' | 'resize' | '';
export type CanvasEventType = `${ElementType}:${EventType}`;

export type EventDispatch = {
  [key in CanvasEventType]?: (e: Event, el: Element, elType: string) => void;
};

export abstract class BaseBehavior {
  mouseStyle = useCursor();
  settings = useSettings();
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  abstract getEventDispatch(): EventDispatch;

  toggleMouseOver(e: MouseEvent) {
    const el = e.target as Element;
    const type = el.getAttribute('data-mouse-style');
    this.mouseStyle.setWithUnlock(type !== null ? type : 'default');
  }

  toggleMouseOut() {
    this.mouseStyle.setWithUnlock('default');
  }
}

export class Register {
  behaviors: BaseBehavior[];
  container: Element;
  globalListenerCleanup: any;
  project: Project;

  constructor(container: Element, project: Project) {
    this.behaviors = [];
    this.container = container;
    this.project = project;
  }

  setProject(project: Project) {
    this.project = project;
  }

  public addBehaviors(...behaviors: (typeof BaseBehavior)[]) {
    behaviors.forEach((b) => {
      this.behaviors.push(Reflect.construct(b, [this.project]));
    });
  }

  public listen() {
    eventTypes.forEach((mouseType) => {
      this.container.addEventListener(mouseType, this.processEvent.bind(this));
    });
    this.globalListenerCleanup = useEventListener(
      document,
      'mouseup',
      this.processEvent.bind(this)
    );
  }

  public removeListen() {
    eventTypes.forEach((mouseType) => {
      this.container.removeEventListener(mouseType, this.processEvent);
    });
    this.globalListenerCleanup();
  }

  private processEvent(e: Event) {
    const el = e.target as Element;
    const eventType = e.type as EventType;
    const elementType = el.getAttribute('data-el-type') ?? 'unknown';
    this.behaviors
      .filter((behavior) => {
        const dispatch = behavior.getEventDispatch();
        const set = new Set(Object.keys(dispatch));
        return set.has(elementType + ':' + eventType) || set.has(':' + eventType);
      })
      .forEach((behavior) => {
        const dispatchEvent = behavior.getEventDispatch();
        dispatchEvent[elementType + ':' + eventType]?.(e, el, eventType, elementType);
        dispatchEvent[':' + eventType]?.(e, el, eventType, elementType);
      });
  }
}
