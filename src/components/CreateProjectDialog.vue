<script setup lang="ts">
import { ref } from 'vue';
import { useGraph } from '@/stores';
import { emitter } from '@/utils';
import { v4 } from 'uuid';

const graph = useGraph();

const visible = ref(false);
const name = ref('');

emitter.on('open-create-project-dialog', () => {
  visible.value = true;
});

function handleCreateProject() {
  graph.addProject({
    description: '',
    id: v4(),
    index: graph.projects.length,
    name: name.value,
    x: 0,
    y: 0
  });
  visible.value = false;
  name.value = '';
}

function handleCancel() {
  visible.value = false;
  name.value = '';
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="创建项目"
    width="300"
    align-center
    style="border-radius: 6px !important"
  >
    <el-input v-model="name" placeholder="请输入项目名称" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleCreateProject"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
