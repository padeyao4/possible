<script setup lang="ts">
import { useEditor } from '@/stores/canvas-editor'
import { computed, ref } from 'vue'
import { currentProject } from '@/service/project.service'
import { useEventListener, useTextareaAutosize } from '@vueuse/core'
import { clamp } from '@/lib/math'
import { useCanvas } from '@/stores/canvas'

const { textarea, triggerResize } = useTextareaAutosize({ styleProp: 'minHeight' })

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
function handleTitleEdit() {
  titleEditenable.value = true
  setTimeout(() => {
    textarea.value?.focus()
  })
}
const detailEditenable = ref(false)
function handleDetailEdit() {
  detailEditenable.value = true
  setTimeout(() => {
    textarea.value?.focus()
  })
}

const recordEditenable = ref(false)
function handleRecordEdit() {
  recordEditenable.value = true
  setTimeout(() => {
    textarea.value?.focus()
  })
}
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
        <textarea
          ref="textarea"
          v-if="titleEditenable"
          v-model="node.name"
          class="text-zone"
          @input="triggerResize"
          @blur="titleEditenable = false"
          @keydown.enter="titleEditenable = false"
          placeholder="标题"
        ></textarea>
        <div v-else class="text-zone">
          {{ node?.name
          }}<my-icon icon="iconoir:edit-pencil" class="edit-icon" @click="handleTitleEdit" />
        </div>
        <textarea
          ref="textarea"
          v-if="detailEditenable"
          v-model="node.detail"
          class="text-zone"
          @input="triggerResize"
          @blur="detailEditenable = false"
          @keydown.enter="detailEditenable = false"
          placeholder="详情"
        ></textarea>
        <div v-else class="text-zone">
          {{ node?.detail }}
          <my-icon icon="iconoir:edit-pencil" class="edit-icon" @click="handleDetailEdit" />
        </div>
        <textarea
          ref="textarea"
          v-if="recordEditenable"
          v-model="node.record"
          class="text-zone"
          @input="triggerResize"
          @blur="recordEditenable = false"
          @keydown.enter="recordEditenable = false"
          placeholder="记录"
        ></textarea>
        <div v-else class="text-zone">
          {{ node?.record }}
          <my-icon icon="iconoir:edit-pencil" class="edit-icon" @click="handleRecordEdit" />
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

textarea {
  border-style: none;
  font-size: 15px;
  font-weight: lighter;
  outline-style: none;
  resize: none;
  background-color: antiquewhite;
  -ms-overflow-style: none;
  scrollbar-width: none;
  word-break: break-all;
  flex-grow: 2 !important;

  &::-webkit-scrollbar {
    display: none;
  }
}

.text-zone {
  border-bottom: 1px solid #00000020;
  padding: 8px 0;
  font-size: 15px;
  font-weight: lighter;
  word-wrap: break-word;
  word-break: break-all;
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
  overflow-y: auto;
  overflow-x: hidden;
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
