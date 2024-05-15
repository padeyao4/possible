import { BaseBehavior, type EventDispatch } from '@/lib/base'
import { useEditor } from '@/stores/canvas-editor'

export class DoubleClickCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'node:dblclick': this.onclick.bind(this)
    }
  }

  onclick(e: MouseEvent, el: Element) {
    if (e.button !== 0) return
    const editor = useEditor()
    editor.x = e.x
    editor.y = e.y
    editor.visible = true
    editor.nodeId = el.getAttribute('data-key')
    document.body.style.cursor = 'default'
  }
}