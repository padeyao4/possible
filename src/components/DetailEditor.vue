<script lang="ts" setup>
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { useLayoutStore, usePlanStore } from '@/stores';
import { emitter } from '@/utils';
import { Delete } from '@element-plus/icons-vue';
import { useEventListener } from '@vueuse/core';
import { computed, reactive } from 'vue';

const planStore = usePlanStore();
const graph = useLayoutStore();

const editorModel = reactive({
  id: null as string | null,
});

const plan = computed(() => {
  return planStore.getPlan(editorModel.id!);
});

const content = [
  { name: 'name', placeholder: '请输入标题' },
  { name: 'description', placeholder: '请输入详情' },
];

emitter.on('open-editor', (params) => {
  editorModel.id = params.id;
  graph.editorVisible = !graph.editorVisible;
});

/**
 * 监听键盘事件，ESC关闭窗口
 */
useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    graph.editorVisible = false;
    editorModel.id = null;
  }
});

function handleDeleteButton() {
  planStore.removePlan(editorModel.id!);
  editorModel.id = null;
}

function handleCloseButton() {
  graph.editorVisible = false;
  editorModel.id = null;
}
</script>

<template>
  <div v-if="graph.editorVisible" class="flex h-screen flex-col">
    <header class="drag-region mb-3 flex w-full shrink-0 items-end justify-between" style="height: 36px">
      <close-icon-button class="no-drag-region ml-2.5 rounded-md border border-gray-300" @click="handleCloseButton" />
    </header>
    <el-scrollbar class="grow">
      <template v-if="plan">
        <div v-for="item in content" :key="item.name" class="m-3">
          <el-input autosize input-style="padding: 16px;" v-model="plan[item.name]" :placeholder="item.placeholder"
            resize="none" size="large" type="textarea" />
        </div>
      </template>
      <template v-else>
        <div class="flex w-full items-center justify-center" style="height: calc(100vh - 96px)">
          <el-empty class="h-full w-full" description="没有数据" />
        </div>
      </template>
    </el-scrollbar>
    <div class="flex h-12 shrink-0 items-center justify-center border-t border-gray-200">
      <el-button :icon="Delete" size="small" @click="handleDeleteButton" />
    </div>
  </div>
</template>
