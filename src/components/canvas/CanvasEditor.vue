<script setup lang="ts">
import { useEditor } from '@/stores/canvas-editor'
import { computed } from 'vue'
import { currentProject } from '@/stores/service/project-service'
import { useEventListener } from '@vueuse/core'
import { clamp } from '@/lib/math'
import { useCanvas } from '@/stores/canvas'

const editor = useEditor()
const project = currentProject()
const canvas = useCanvas()

const style = computed(() => {
    const canvasRect = canvas.svg?.getBoundingClientRect() ?? { left: 0, right: 0, top: 0, bottom: 0 }
    const x = clamp(editor.x, canvasRect.left, canvasRect.right - editor.width)
    const y = clamp(editor.y, canvasRect.top, canvasRect.bottom - editor.height)
    return {
      top: y + 'px',
      left: x + 'px',
      width: editor.width + 'px',
      height: editor.height + 'px'
    }
  }
)

const node = computed(() => {
  return project.nodeMap.get(editor.nodeId)
})

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    editor.visible = false
  }
})

function handleCancel(e: MouseEvent) {
  const el = e.target as HTMLElement
  if (el.hasAttribute('data-flag')) {
    editor.visible = false
  }
}

</script>

<template>
  <div id="node-editor-mode" :style="{'display':`${editor.visible ? 'flex' : 'none'}`}" data-flag @click="handleCancel"
       @contextmenu.prevent>
    <div id="node-editor" :style="style">
      <div class="editor-body">
        <div>{{ node?.name }}</div>
        <div>{{ node?.detail }}</div>
        <div>{{ node?.record }}</div>
      </div>
      <div class="editor-footer">
        <div>scroll导航</div>
        <div>esc关闭</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

#node-editor-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  background-color: transparent;
}

#node-editor {
  position: fixed;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border-color: #00000080;
  border-width: 1px;
  border-style: solid;
  background-color: #f5f5f7;
  overflow: hidden;
}

.editor-body {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
  padding: 0 8px;
  user-select: text;
  -webkit-user-select: text;
}

.editor-footer {
  display: flex;
  height: 24px;
  width: 100%;
  flex-shrink: 0;
  padding: 0 8px;
  background-color: #f3f3f5;
  border-top: solid 1px #00000020;
  justify-content: center;
  align-items: center;

  & > * {
    margin: 0 6px;
    font-size: 14px;
    font-weight: lighter;
  }
}
</style>