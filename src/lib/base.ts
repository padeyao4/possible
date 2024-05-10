import type { Ref } from 'vue'

export abstract class BaseBehavior {
  svg: HTMLElement

  group: SVGGElement

  grid: HTMLElement

  ruler: HTMLElement

  protected constructor(svg: HTMLElement, group: SVGGElement, grid: HTMLElement, ruler: HTMLElement) {
    this.svg = svg
    this.group = group
    this.grid = grid
    this.ruler = ruler
  }

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
}

export class Register {
  behaviors: BaseBehavior[]

  svgRef: Ref<HTMLElement>

  groupRef: Ref<SVGGElement>

  gridRef: Ref<HTMLElement>

  rulerRef: Ref<HTMLElement>

  headerRef: Ref<HTMLElement>

  constructor(svgRef: Ref<HTMLElement>,
              groupRef: Ref<SVGGElement>,
              gridRef: Ref<HTMLElement>,
              rulerRef: Ref<HTMLElement>,
              headerRef: Ref<HTMLElement>) {
    this.svgRef = svgRef
    this.gridRef = gridRef
    this.groupRef = groupRef
    this.rulerRef = rulerRef
    this.headerRef = headerRef
    this.behaviors = []
  }

  addBehaviors(...behaviors: BaseBehavior[]) {
    this.behaviors.push(...behaviors)
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
}