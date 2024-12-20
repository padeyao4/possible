<script lang="ts" setup>
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { useLayoutStore, usePlanStore } from '@/stores';
import { emitter } from '@/utils';
import { Delete } from '@element-plus/icons-vue';
import { useEventListener } from '@vueuse/core';
import { computed, reactive } from 'vue';

const planStore = usePlanStore();
const layoutStore = useLayoutStore();

const editorModel = reactive({
  id: null as string | null,
});

const plan = computed(() => {
  return planStore.getPlan(editorModel.id!);
});

emitter.on('open-editor', (params) => {
  if (editorModel.id !== params.id) {
    layoutStore.editorVisible = true;
    editorModel.id = params.id;
  } else {
    layoutStore.editorVisible = !layoutStore.editorVisible;
  }
});

/**
 * 监听键盘事件，ESC关闭窗口
 */
useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    layoutStore.editorVisible = false;
    editorModel.id = null;
  }
});

function handleDeleteButton() {
  planStore.removePlan(editorModel.id!);
  editorModel.id = null;
}

function handleCloseButton() {
  layoutStore.editorVisible = false;
  editorModel.id = null;
}

// 添加日期格式化函数
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

</script>

<template>
  <div v-if="layoutStore.editorVisible" class="flex h-screen flex-col">
    <header class="drag-region mb-3 flex w-full shrink-0 items-end justify-between" style="height: 36px">
      <close-icon-button class="no-drag-region ml-2.5 rounded-md border border-gray-300" @click="handleCloseButton" />
    </header>
    <el-scrollbar class="grow">
      <template v-if="plan">
        <div class="px-4 py-2 space-y-4">
          <!-- 标题输入 -->
          <div class="space-y-2">
            <div class="text-sm text-gray-500">标题</div>
            <el-input v-model="plan.name" placeholder="请输入标题" size="large" />
          </div>

          <!-- 描述输入 -->
          <div class="space-y-2">
            <div class="text-sm text-gray-500">描述</div>
            <el-input v-model="plan.description" type="textarea" :autosize="{ minRows: 3, maxRows: 7 }"
              placeholder="请输入描述" resize="vertical" />
          </div>

          <!-- 折叠框 -->
          <el-collapse>
            <el-collapse-item title="更多信息" name="1">
              <!-- 时间信息 -->
              <div class="space-y-2">
                <div class="text-sm text-gray-500">创建时间</div>
                <div class="text-sm">{{ formatDate(plan.createdAt ?? 0) }}</div>
              </div>

              <div v-if="plan.updatedAt" class="space-y-2">
                <div class="text-sm text-gray-500">更新时间</div>
                <div class="text-sm">{{ formatDate(plan.updatedAt) }}</div>
              </div>

              <!-- 状态信息 -->
              <div class="space-y-2">
                <div class="text-sm text-gray-500">状态</div>
                <el-switch v-model="plan.isDone" active-text="已完成" inactive-text="进行中" />
              </div>

              <!-- 位置信息 -->
              <div class="space-y-2">
                <div class="text-sm text-gray-500">位置</div>
                <div class="grid grid-cols-2 gap-4">
                  <el-input-number v-model="plan.x" :min="-999" :precision="0" :step="1" :controls="false" size="small"
                    placeholder="X坐标" />
                  <el-input-number v-model="plan.y" :min="0" :precision="0" :step="1" :controls="false" size="small"
                    placeholder="Y坐标" />
                </div>
              </div>

              <!-- 尺寸信息 -->
              <div class="space-y-2">
                <div class="text-sm text-gray-500">尺寸</div>
                <div class="grid grid-cols-2 gap-4">
                  <el-input-number v-model="plan.width" :min="1" :precision="0" :step="1" :controls="false" size="small"
                    placeholder="宽度" />
                  <el-input-number v-model="plan.height" :min="1" :precision="0" :step="1" :controls="false"
                    size="small" placeholder="高度" />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
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

<style scoped>
.el-input {
  width: 100%;
}
</style>
