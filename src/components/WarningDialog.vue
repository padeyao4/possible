<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import emitter from '@/utils/emitter';
import { useProjectStore } from '@/stores';
import { Project } from '@/core';

const visible = ref(false);

const projects = useProjectStore();
const project = ref<Project>();

emitter.on('project:open', (e) => {
  project.value = e;
  visible.value = true;
});

const handleDelete = () => {
  visible.value = false;
  projects.removeProject(project.value?.id);
};

onUnmounted(() => {
  emitter.off('project:open');
});
</script>

<template>
  <el-dialog v-model="visible" title="删除" width="500" align-center class="rounded-md">
    <el-text truncated>确定删除{{ project?.name ?? '' }}项目吗</el-text>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleDelete"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
