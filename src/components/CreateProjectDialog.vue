<script setup lang="ts">
import { ref } from 'vue';
import { days, generateIndex, useDataStore } from '@/stores';
import { emitter } from '@/utils';
import { v4 } from 'uuid';
import router from '@/router';

const graph = useDataStore();

const visible = ref(false);
const name = ref('');

emitter.on('open-create-project-dialog', () => {
  visible.value = true;
});

function handleCreateProject() {
  const projectName = name.value.trim() === '' ? `新建项目(${graph.projectsMap.size + 1})` : name.value.trim();
  const projectId = v4();
  graph.setProject({
    description: '',
    id: projectId,
    index: generateIndex(),
    name: projectName,
    x: -days(Date.now()) * graph.cardWidth,
    y: 0,
    createdAt: Date.now()
  });
  visible.value = false;
  name.value = '';
  setTimeout(() => {
    router.push({ name: 'project', query: { id: projectId } });
  })
}

function handleCancel() {
  visible.value = false;
  name.value = '';
}
</script>

<template>
  <el-dialog v-model="visible" title="创建项目" width="300" align-center style="border-radius: 6px !important">
    <el-input v-model="name" placeholder="请输入项目名称" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleCreateProject"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
