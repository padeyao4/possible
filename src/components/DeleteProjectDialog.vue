<script setup lang="ts">
import { usePlanStore, type Plan } from '@/stores';
import { emitter } from '@/utils';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const model = reactive({
  visible: false,
  project: undefined as Plan | undefined
});

const router = useRouter();
const route = useRoute();
const planStore = usePlanStore();

emitter.on('open-delete-project-dialog', (project) => {
  model.project = project;
  model.visible = true;
});

const handleDelete = () => {
  model.visible = false;
  route.name === 'project' &&
    route.query.id === model.project?.id &&
    router.push({ name: 'today' });
  setTimeout(() => {
    planStore.removePlan(model.project?.id!);
  });
};
</script>

<template>
  <el-dialog v-model="model.visible" title="删除" width="500" align-center style="border-radius: 6px !important">
    <el-text truncated>确定删除 <i>"{{ model.project?.name }}"</i> 项目吗</el-text>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="model.visible = false">取消</el-button>
        <el-button type="primary" @click="handleDelete"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
