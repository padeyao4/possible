<script setup lang="ts">
import $bus from '@/lib/bus'
import { currentProject } from '@/service/project.service'
import { useEventListener, useTextareaAutosize } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const width = ref(300)
const visible = ref(false)
const contentType = ref('node')

const { textarea: nameTextarea, input: nameInput } = useTextareaAutosize()
const { textarea: detailTextarea, input: detailInput } = useTextareaAutosize()
const { textarea: recordTextarea, input: recordInput } = useTextareaAutosize()

const widthStyle = computed(() => {
  return (visible.value ? width.value : 16) + 'px'
})

const project = currentProject()

const nameWatchHandle = ref()
const detailWatchHandle = ref()
const recordWatchHandle = ref()

onMounted(() => {
  $bus.on(
    'open-editor',
    ({
      id,
      shapeType
    }: {
      event: PointerEvent
      id: string
      shapeType: 'node' | 'canvas' | 'edge'
    }) => {
      contentType.value = shapeType
      visible.value = true
      const node = project.nodeMap.get(id)
      nameInput.value = node.name
      detailInput.value = node.detail
      recordInput.value = node.record

      nameWatchHandle.value?.()
      nameWatchHandle.value = watch(nameInput, () => {
        node.name = nameInput.value
      })
      detailWatchHandle.value?.()
      detailWatchHandle.value = watch(detailInput, () => {
        node.detail = detailInput.value
      })
      recordWatchHandle.value?.()
      recordWatchHandle.value = watch(recordInput, () => {
        node.record = recordInput.value
      })
    }
  )
  $bus.on('close-editor', () => {
    visible.value = false
    contentType.value = 'canvas'
    nameWatchHandle.value?.()
    detailWatchHandle.value?.()
    recordWatchHandle.value?.()
  })

  $bus.on('home-editor', () => {
    contentType.value = 'canvas'
    nameWatchHandle.value?.()
    detailWatchHandle.value?.()
    recordWatchHandle.value?.()
  })
})

onUnmounted(() => {
  $bus.off('open-editor')
})

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    $bus.emit('close-editor')
  }
})

function handleCloseButton() {
  visible.value = false
}
</script>
<template>
  <div class="editor-component">
    <div v-if="visible">
      <div class="header-bar">
        <my-icon icon="iconamoon:close-thin" @click="handleCloseButton" />
      </div>
      <div v-if="contentType === 'node'" class="node-info">
        <div class="card">
          <textarea ref="nameTextarea" v-model="nameInput" placeholder=""></textarea>
        </div>
        <div class="card">
          <textarea ref="detailTextarea" v-model="detailInput" placeholder=""></textarea>
        </div>
        <div class="card">
          <textarea ref="recordTextarea" v-model="recordInput" placeholder=""></textarea>
        </div>
      </div>
      <div v-else class="canvas-editor">
        <h1>没有选择内容</h1>
      </div>
    </div>
    <div v-else class="target-info"></div>
  </div>
</template>

<style scoped>
.editor-component {
  flex-shrink: 0;
  width: v-bind(widthStyle);
  background-color: var(--background-middle-color);
}

.node-info {
  display: flex;
  flex-direction: column;
}

.target-info {
  background-color: transparent;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px;
  padding: 12px;
  background-color: var(--background-top-color);
  border: 1px solid #00000015;
  border-radius: 3px;
}

textarea {
  width: 100%;
  height: 100%;
  color: #00000095;
  font-size: var(--font-middle-size);
  background-color: var(--background-top-color);
  border: none;
  outline: none;
  resize: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea::-webkit-scrollbar {
  display: none;
}

input {
  outline: none;
}

.canvas-editor {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  background-color: antiquewhite;
}

.header-bar {
  display: flex;
  flex-direction: row-reverse;
  & > * {
    width: 24px;
    height: 24px;
    margin: 12px;
    opacity: 0.6;
    &:hover {
      background-color: antiquewhite;
    }
  }
}
</style>