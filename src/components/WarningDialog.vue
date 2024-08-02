<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { emitter } from '@/utils';
import { useProjects } from '@/stores';
import { Project } from '@/core';
import { useRoute, useRouter } from 'vue-router';

const visible = ref(false);

const projects = useProjects();
const project = ref<Project>();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  emitter.on('project-dialog:open', (e) => {
    console.log('listen on project:open');
    project.value = e as Project;
    visible.value = true;
  });
});

const handleDelete = () => {
  visible.value = false;
  const id = project.value?.id;
  if (route.name === 'project' && route.query.id === id) {
    router.push({ name: 'today' });
  }
  projects.removeProject(id);
};

onUnmounted(() => {
  emitter.off('project-dialog:open');
  console.log('off project:open');
});
</script>

<template>
  <el-dialog
    v-model="visible"
    title="删除"
    width="500"
    align-center
    style="border-radius: 6px !important"
  >
    <el-text truncated>确定删除{{ project?.name ?? '' }}项目吗</el-text>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleDelete"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
