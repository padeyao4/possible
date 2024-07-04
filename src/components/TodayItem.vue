<script setup lang="ts">
import { Node } from '@/core/';
import { Check } from '@element-plus/icons-vue';
import { useProjectStore } from '@/stores';
import { ref } from 'vue';

const { node } = defineProps<{
  node: Node;
}>();

const projects = useProjectStore();

const project = projects.getProject(node.projectId);

const showIcon = ref(false);

const handleChange = () => {
  node.set({ completed: !node.completed });
};
</script>

<template>
  <div
    class="flex h-14 w-full flex-row items-center rounded-lg border border-gray-200 hover:bg-blue-100"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="mx-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-500"
      @click="handleChange"
    >
      <el-icon v-show="node.completed" size="16"><Check /></el-icon>
    </div>
    <div class="flex h-full grow flex-col overflow-hidden">
      <div
        class="flex h-3/5 w-40 items-end justify-start overflow-hidden bg-amber-100 text-base text-gray-600"
      >
        {{ node.name }}
      </div>
      <div class="flex h-2/5 items-start text-xs text-gray-600">{{ project.name }}</div>
    </div>
    <div
      v-show="showIcon"
      class="icon-[icon-park-outline--drag] ml-auto mr-2 block shrink-0 border border-black text-xl"
      data-move
    />
  </div>
</template>
