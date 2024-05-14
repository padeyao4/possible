import { changeMouseStyle } from '@/stores/mouse'

export abstract class BaseBehavior {
  onmouseup(e: MouseEvent) {
  }

  onmouseover(e: MouseEvent) {
  }

  onmousedown(e: MouseEvent) {
  }

  onwheel(e: WheelEvent) {
  }

  onclick(e: MouseEvent) {
  }

  onmouseout(e: MouseEvent) {
  }

  onmousemove(e: MouseEvent) {
  }

  onmouseenter(e: MouseEvent) {
  }

  onmouseleave(e: MouseEvent) {
  }

  ondblclick(e: MouseEvent) {
  }

  toggleMouseOver(e: MouseEvent) {
    const el = e.target as Element
    const type = el.getAttribute('data-mouse-type')
    changeMouseStyle(type !== null ? type : 'default')
  }
}

export class Register {
  behaviors: BaseBehavior[]

  constructor() {
    this.behaviors = []
  }

  addBehaviors(...behaviors: (typeof BaseBehavior)[]) {
    behaviors.forEach(b => {
      this.behaviors.push(Reflect.construct(b, []))
    })
  }

  onmouseup(e: MouseEvent) {
    this.behaviors.forEach(b => b.onmouseup(e))
  }

  onmousemove(e: MouseEvent) {
    this.behaviors.forEach(b => b.onmousemove(e))
  }

  onmouseout(e: MouseEvent) {
    this.behaviors.forEach(b => b.onmouseout(e))
  }

  onmouseenter(e: MouseEvent) {
    this.behaviors.forEach(b => b.onmouseenter(e))
  }

  onmouseleave(e: MouseEvent) {
    this.behaviors.forEach(b => b.onmouseleave(e))
  }

  onmouseover(e: MouseEvent) {
    this.behaviors.forEach(b => b.onmouseover(e))
  }

  onmousedown(e: MouseEvent) {
    this.behaviors.forEach(b => b.onmousedown(e))
  }

  onwheel(e: WheelEvent) {
    this.behaviors.forEach(b => b.onwheel(e))
  }

  onclick(e: MouseEvent) {
    this.behaviors.forEach(b => b.onclick(e))
  }

  ondblclick(e: MouseEvent) {
    this.behaviors.forEach(b => b.ondblclick(e))
  }
}