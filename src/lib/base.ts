import type { Project } from '@/stores/projects'
import { type MouseStyleType, useMouseStyle } from '@/stores/mouse'
import { type SettingsType, useSettings } from '@/stores/settings'
import { useEventListener } from '@vueuse/core'

const eventTypes = ['mouseover', 'mouseout', 'mousedown', 'mouseup', 'mousemove', 'click', 'dblclick', 'contextmenu']

export type EventType =
  'mouseover'
  | 'mouseout'
  | 'mousedown'
  | 'mouseup'
  | 'mousemove'
  | 'click'
  | 'dblclick'
  | 'contextmenu'
export type ElementType = 'canvas' | 'node' | 'edge' | 'anchor' | 'resize' | ''
export type CanvasEventType = `${ElementType}:${EventType}`


export type EventDispatch = {
  [key in CanvasEventType]?: (e: Event, el: Element, elType: string) => void
}

export abstract class BaseBehavior {
  project: Project
  mouseStyle: MouseStyleType
  settings: SettingsType

  constructor(project: Project, mouseStyle: MouseStyleType, settings: SettingsType) {
    this.project = project
    this.mouseStyle = mouseStyle
    this.settings = settings
  }

  abstract getEventDispatch(): EventDispatch

  toggleMouseOver(e: MouseEvent) {
    const el = e.target as Element
    const type = el.getAttribute('data-mouse-style')
    this.mouseStyle.setStyleWithUnlock(type !== null ? type : 'default')
  }

  toggleMouseOut() {
    this.mouseStyle.setStyleWithUnlock('default')
  }
}

export class Register {
  behaviors: BaseBehavior[]
  container: Element
  project: Project
  mouseStyle: MouseStyleType
  settings: SettingsType
  globalListenerCleanup: any

  constructor(container: Element, project: Project) {
    this.behaviors = []
    this.container = container
    this.project = project
    this.mouseStyle = useMouseStyle()
    this.settings = useSettings()
  }

  public addBehaviors(...behaviors: (typeof BaseBehavior)[]) {
    behaviors.forEach(b => {
      this.behaviors.push(Reflect.construct(b, [this.project, this.mouseStyle, this.settings]))
    })
  }

  public listen() {
    eventTypes.forEach(mouseType => {
      this.container.addEventListener(mouseType, this.processEvent.bind(this))
    })
    this.globalListenerCleanup = useEventListener(document, 'mouseup', this.processEvent.bind(this))
  }

  public removeListen() {
    eventTypes.forEach(mouseType => {
      this.container.removeEventListener(mouseType, this.processEvent)
    })
    this.globalListenerCleanup()
  }

  private processEvent(e: Event) {
    const el = e.target as Element
    const eventType = e.type as EventType
    const elementType = el.getAttribute('data-el-type') ?? 'unknown'
    this.behaviors.filter(behavior => {
      const dispatch = behavior.getEventDispatch()
      const set = new Set(Object.keys(dispatch))
      return set.has(elementType + ':' + eventType) || set.has(':' + eventType)
    }).forEach(behavior => {
      const dispatchEvent = behavior.getEventDispatch()
      dispatchEvent[elementType + ':' + eventType]?.(e, el, eventType, elementType)
      dispatchEvent[':' + eventType]?.(e, el, eventType, elementType)
    })
  }
}