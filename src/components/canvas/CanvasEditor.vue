<script setup lang="ts">
import { useEditor } from '@/stores/canvas-editor'
import { computed, ref } from 'vue'
import { currentProject } from '@/stores/service/project.service'
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
})

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

const titleEditenable = ref(false)
function handleTitleRef(e: HTMLElement | null) {
  setTimeout(() => {
    e?.focus()
  })
}
// const recordEditenable = ref(false)
// const detailEditenable = ref(false)
</script>

<template>
  <div
    class="node-editor-mode"
    :style="{ display: `${editor.visible ? 'flex' : 'none'}` }"
    data-flag
    @click="handleCancel"
    @contextmenu.prevent
  >
    <div class="node-editor" :style="style">
      <div class="editor-body">
        <input
          v-if="titleEditenable"
          v-model="node.name"
          :ref="handleTitleRef"
          class="title"
          @blur="titleEditenable = false"
          @keydown.enter="titleEditenable = false"
          placeholder="标题"
        />
        <div v-else class="title">
          {{ node?.name
          }}<Icon icon="iconoir:edit-pencil" class="edit-icon" @click="titleEditenable = true" />
        </div>
        <div class="detail">
          {{ node?.detail }} <Icon icon="iconoir:edit-pencil" class="edit-icon" />
        </div>
        <div class="record">
          {{ node?.record }} <Icon icon="iconoir:edit-pencil" class="edit-icon" />
        </div>
      </div>
      <div class="editor-footer">
        <div>scroll导航</div>
        <div>esc关闭</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  vertical-align: text-bottom;
  color: #00000080;
  width: 16px;
  height: 16px;
  &:hover {
    color: #00000098;
    background-color: antiquewhite;
    border-radius: 2px;
    cursor: pointer;
  }
}

.title {
  border-bottom: 1px solid #00000020;
  margin: 8px 0;
  font-size: 15px;
  font-weight: lighter;
}

input {
  border-style: none;
  border: 0;
  font-size: 15px;
  font-weight: lighter;
  outline-style: none;
  background-color: antiquewhite;
}

.detail {
  border-bottom: 1px solid #00000020;
  font-size: 15px;
  font-weight: lighter;
}

.record {
  font-size: 15px;
  font-weight: lighter;
}

.node-editor-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  background-color: transparent;
}

.node-editor {
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
  & > * {
    padding: 8px 0;
  }
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
