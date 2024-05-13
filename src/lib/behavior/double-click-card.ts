import { BaseBehavior } from '@/lib/base'
import { useEditor } from '@/stores/editor'

export class DoubleClickCard extends BaseBehavior {
  ondblclick(e: MouseEvent) {
    const el = e.target as Element
    if (e.button !== 0 || el.getAttribute('data-type') !== 'node') return
    const editor = useEditor()
    editor.x = e.x
    editor.y = e.y
    editor.visible = true
    editor.nodeId = el.getAttribute('data-key')
    document.body.style.cursor = 'default'
  }
}