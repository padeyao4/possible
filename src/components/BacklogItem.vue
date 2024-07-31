<script setup lang="ts">
import { computed, inject, type Ref, ref } from 'vue';
import { type Backlog } from '@/core';
import { Check } from '@element-plus/icons-vue';
import { emitter } from '@/utils';

const { item } = defineProps<{ item: Backlog }>();

const handleIconClick = () => (item.done = !item.done);

const editorVisible = inject<Ref<boolean>>('editorVisible');
const editorBacklog = inject<Ref<Backlog>>('editorBacklog');

const handleTextClick = () => {
  if (editorVisible.value) {
    emitter.emit(
      editorBacklog?.value?.id === item.id ? 'editor-backlog:close' : 'editor-backlog:open',
      item
    );
  } else {
    emitter.emit('editor-backlog:open', item);
  }
};

const active = computed(() => {
  return editorBacklog?.value?.id === item.id;
});

const showIcon = ref(false);
</script>

<template>
  <div
    class="flex h-14 w-full items-center rounded-lg  bg-white hover:bg-blue-50"
    :class="{ 'bg-blue-50': active }"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="mx-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-500 hover:cursor-pointer"
      @click="handleIconClick"
    >
      <el-icon v-show="item.done" size="16"><Check /></el-icon>
    </div>
    <div class="flex h-full grow items-center overflow-hidden" @click="handleTextClick">
      <el-text truncated :tag="item.done ? 'del' : 'span'"> {{ item.title }} </el-text>
    </div>
    <div
      v-show="showIcon"
      class="icon-[icon-park-outline--drag] ml-auto mr-2 block shrink-0 border border-black bg-gray-500 text-xl"
      data-move
    />
  </div>
</template>
