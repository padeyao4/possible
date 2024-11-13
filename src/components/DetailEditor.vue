<script lang="ts" setup>
import { emitter } from '@/utils';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { computed, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import { useEventListener } from '@vueuse/core';
import { Delete } from '@element-plus/icons-vue';
import { useBacklogs, useLayout, useProjects } from '@/stores';

const contents = [
  {
    type: 'node',
    data: [
      { name: 'name', placeholder: '请输入标题' },
      { name: 'detail', placeholder: '请输入详情' },
      {
        name: 'record',
        placeholder: '请输入内容'
      }
    ]
  },
  {
    type: 'backlog',
    data: [
      {
        name: 'title',
        placeholder: '请输入内容'
      }
    ]
  }
];


const layout = useLayout();

const item = ref();
const itemType = ref();

const content = computed(()=>{
  return contents.find((item) => item.type === itemType.value)?.data;
})

emitter.on('editor:open', (e) => {
  if (!layout.showRight || e.type !== itemType.value || e.item.id !== item.value?.id) {
    layout.showRight = true;
    item.value = e.item;
    itemType.value = e.type;
  } else {
    layout.showRight = false;
  }
});

emitter.on('editor:delete',()=>{
  item.value = null;
  itemType.value = ''
})

emitter.on('editor:close', () => {
  layout.showRight = false;
});

onBeforeUnmount(() => {
  emitter.off('editor:open');
  emitter.off('editor:close');
});

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') {
    layout.showRight = false;
  }
});

const backlogs = useBacklogs();
const projects = useProjects();

const handleDelete = () => {
  if (itemType.value === 'backlog') {
    backlogs.remove(item.value.id);
    emitter.emit('backlog:delete', { id: item.value.id });
    item.value = null;
    itemType.value = ''
    return;
  }
  if (itemType.value === 'node') {
    const project = projects.getProject(item.value.projectId);
    project.removeNode(item.value.id);
    emitter.emit('node:delete', item.value);
    item.value = null;
    itemType.value = ''
    return;
  }
};
</script>

<template>
  <div v-if="layout.showRight" class="flex h-screen flex-col">
    <header
      class="drag-region mb-3 flex w-full shrink-0 items-end justify-between"
      style="height: 36px"
    >
      <close-icon-button
        class="no-drag-region ml-2.5 rounded-md border border-gray-300"
        @click="layout.showRight = false"
      />
      <div
        class="h-full rounded-bl-lg border border-b border-l border-gray-200"
        style="width: 139px"
      ></div>
    </header>
    <el-scrollbar class="grow">
      <template v-if="content">
        <div v-for="i in content" class="m-3">
          <el-input
            autosize
            input-style="padding: 16px;"
            v-model="item[i.name]"
            :placeholder="i.placeholder"
            resize="none"
            size="large"
            type="textarea"
          />
        </div>
      </template>
      <template v-else>
        <div class="flex w-full items-center justify-center" style="height: calc(100vh - 96px)">
          <el-empty class="h-full w-full" description="没有数据" />
        </div>
      </template>
    </el-scrollbar>
    <div class="flex h-12 shrink-0 items-center justify-center border-t border-gray-200">
      <el-button :icon="Delete" size="small" @click="handleDelete" />
    </div>
  </div>
</template>
