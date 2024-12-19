<script setup lang="ts">
import router from '@/router';
import { CARD_WIDTH, days, generateIndex, usePlanStore } from '@/stores';
import { emitter } from '@/utils';
import { v4 } from 'uuid';
import { reactive } from 'vue';

const viewModel = reactive({
  visible: false,
  name: ''
});

const planStore = usePlanStore();

emitter.on('open-create-project-dialog', () => {
  viewModel.visible = true;
});

function handleCreateProject() {
  const name =
    viewModel.name.trim() === '' ? `新建项目(${planStore.projects.length + 1})` : viewModel.name.trim();
  const id = v4();

  planStore.addPlan({
    id,
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    index: generateIndex(),
    offsetX: -days(Date.now()) * CARD_WIDTH,
    offsetY: 0,
    expanded: true,
  }, true
  );

  reset();
  setTimeout(() => {
    router.push({ name: 'project', query: { id } });
  });
}

function reset() {
  viewModel.visible = false;
  viewModel.name = '';
}
</script>

<template>
  <el-dialog v-model="viewModel.visible" title="创建项目" width="300" align-center style="border-radius: 6px !important">
    <el-input v-model="viewModel.name" placeholder="请输入项目名称" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="reset">取消</el-button>
        <el-button type="primary" @click="handleCreateProject"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
