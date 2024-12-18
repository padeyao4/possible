<script lang="ts" setup>
import { emitter } from '@/utils';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { computed, reactive } from 'vue';
import { Delete } from '@element-plus/icons-vue';
import { useDataStore, useBacklogStore } from '@/stores';
import { useEventListener } from '@vueuse/core';

const graph = useDataStore();
const meno = useBacklogStore();

type ContentType = 'node' | 'backlog';

const editorModel = reactive({
  contentKey: null as ContentType | null,
  itemId: null as string | null
});

const contents = {
  node: [
    { name: 'name', placeholder: '请输入标题' },
    { name: 'detail', placeholder: '请输入详情' },
    {
      name: 'record',
      placeholder: '请输入内容'
    }
  ],
  backlog: [
    {
      name: 'name',
      placeholder: '请输入内容'
    }
  ]
};

const content = computed(() => {
  return contents[editorModel.contentKey!];
});

const itemModel = computed(() => {
  switch (editorModel.contentKey) {
    case 'node':
      return graph.nodesMap.get(editorModel.itemId!);
    case 'backlog':
      return meno.backlogsMap.get(editorModel.itemId!);
    default:
      return undefined;
  }
});

emitter.on('open-canvas-card-editor', (params) => {
  if (editorModel.itemId === params.nodeId) {
    editorModel.itemId = null;
    editorModel.contentKey = 'node';
    graph.editorVisible = false;
  } else {
    editorModel.itemId = params.nodeId;
    editorModel.contentKey = 'node';
    graph.editorVisible = true;
  }
});

emitter.on('open-canvas-card-editor-by-menu', (params) => {
  editorModel.itemId = params.nodeId;
  editorModel.contentKey = 'node';
  graph.editorVisible = true;
});

emitter.on('open-backlog-editor', (params) => {
  if (editorModel.itemId === params.id) {
    editorModel.itemId = null;
    editorModel.contentKey = 'backlog';
    graph.editorVisible = false;
  } else {
    editorModel.itemId = params.id!;
    editorModel.contentKey = 'backlog';
    graph.editorVisible = true;
  }
});

/**
 * 监听键盘事件，ESC关闭窗口
 */
useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    graph.editorVisible = false;
    editorModel.itemId = null;
  }
});

function handleDeleteButton() {
  if (editorModel.contentKey === 'node') {
    graph.removeNode(editorModel.itemId!);
  } else if (editorModel.contentKey === 'backlog') {
    meno.remove(editorModel.itemId!);
  }
}

function handleCloseButton() {
  graph.editorVisible = false;
  editorModel.itemId = null;
}
</script>

<template>
  <div v-if="graph.editorWidth !== 0" class="flex h-screen flex-col">
    <header class="drag-region mb-3 flex w-full shrink-0 items-end justify-between" style="height: 36px">
      <close-icon-button class="no-drag-region ml-2.5 rounded-md border border-gray-300" @click="handleCloseButton" />
    </header>
    <el-scrollbar class="grow">
      <template v-if="content && itemModel">
        <div v-for="item in content" :key="item.name" class="m-3">
          <el-input autosize input-style="padding: 16px;" v-model="itemModel[item.name]" :placeholder="item.placeholder"
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
