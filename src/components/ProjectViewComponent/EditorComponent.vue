<script setup lang="ts">
import emitter, { BusEvents } from '@/utils/emitter';
import { currentProject } from '@/service/project.service';
import { useEventListener, useTextareaAutosize } from '@vueuse/core';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';

const width = ref(300);
const visible = ref(false);
const contentType = ref('node');

const { textarea: nameTextarea, input: nameInput } = useTextareaAutosize();
const { textarea: detailTextarea, input: detailInput } = useTextareaAutosize();
const { textarea: recordTextarea, input: recordInput } = useTextareaAutosize();

const widthStyle = computed(() => {
  return (visible.value ? width.value : 16) + 'px';
});

const project = currentProject();

const nameWatchHandle = ref();
const detailWatchHandle = ref();
const recordWatchHandle = ref();

watch([nameInput, detailInput, recordInput], () => {
  emitter.emit(BusEvents['node:updated']);
});

onMounted(() => {
  emitter.on(
    BusEvents['editor:open'],
    ({
      id,
      shapeType
    }: {
      event: PointerEvent;
      id: string;
      shapeType: 'node' | 'canvas' | 'edge';
    }) => {
      console.log(id, shapeType);
      contentType.value = shapeType;
      visible.value = true;
      const node = project.nodeMap.get(id);
      nameInput.value = node.name;
      detailInput.value = node.detail;
      recordInput.value = node.record;

      nameWatchHandle.value?.();
      nameWatchHandle.value = watch(nameInput, () => {
        node.name = nameInput.value;
      });
      detailWatchHandle.value?.();
      detailWatchHandle.value = watch(detailInput, () => {
        node.detail = detailInput.value;
      });
      recordWatchHandle.value?.();
      recordWatchHandle.value = watch(recordInput, () => {
        node.record = recordInput.value;
      });
    }
  );
  emitter.on(BusEvents['editor:close'], () => {
    visible.value = false;
    contentType.value = 'canvas';
    nameWatchHandle.value?.();
    detailWatchHandle.value?.();
    recordWatchHandle.value?.();
  });

  emitter.on('home-editor', () => {
    contentType.value = 'canvas';
    nameWatchHandle.value?.();
    detailWatchHandle.value?.();
    recordWatchHandle.value?.();
  });
});

onUnmounted(() => {
  emitter.off(BusEvents['editor:close']);
  emitter.off(BusEvents['editor:open']);
});

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emitter.emit(BusEvents['editor:close']);
  }
});

function handleCloseButton() {
  visible.value = false;
}
</script>
<template>
  <div class="editor-component">
    <div v-if="visible">
      <div class="header-bar">
        <Icon icon="iconamoon:close-thin" @click="handleCloseButton" />
      </div>
      <div v-if="contentType === 'node'" class="node-info">
        <div class="card">
          <textarea ref="nameTextarea" v-model="nameInput" placeholder="任务标题"></textarea>
        </div>
        <div class="card">
          <textarea ref="detailTextarea" v-model="detailInput" placeholder="添加备注"></textarea>
        </div>
        <div class="card">
          <textarea ref="recordTextarea" v-model="recordInput" placeholder="过程记录"></textarea>
        </div>
      </div>
      <div v-else class="canvas-editor"></div>
    </div>
    <div v-else class="target-info"></div>
  </div>
</template>

<style scoped>
.editor-component {
  flex-shrink: 0;
  width: v-bind(widthStyle);
  background-color: var(--background-bottom-color);
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

textarea::placeholder {
  color: #00000060;
  opacity: 0.7;
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
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row-reverse;
  background-color: var(--background-bottom-color);
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
