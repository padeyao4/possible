<script setup lang="ts">
import { Node } from '@/core/';
import { Check } from '@element-plus/icons-vue';
import { useProjects } from '@/stores';
import { ref } from 'vue';

const { node } = defineProps<{
  node: Node;
}>();

const projects = useProjects();

const project = projects.getProject(node.projectId);

const showIcon = ref(false);

const handleChange = () => {
  node.update({ completed: !node.completed });
};
</script>

<template>
  <div
    class="flex h-14 w-full flex-row items-center rounded-lg border border-gray-200 hover:bg-blue-50"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="mx-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-500 hover:cursor-pointer"
      @click="handleChange"
    >
      <el-icon v-show="node.completed" size="16"><Check /></el-icon>
    </div>
    <div class="flex h-full grow flex-col justify-center overflow-hidden">
      <div class="block truncate align-bottom text-base text-gray-500">
        {{ node.name }}
      </div>
      <div class="block h-fit items-start truncate text-xs text-gray-500">
        {{ project.name }}
      </div>
    </div>
    <div
      v-show="showIcon"
      class="icon-[icon-park-outline--drag] ml-auto mr-2 block w-10 shrink-0 border border-black bg-gray-500 text-xl"
      data-move
    />
  </div>
</template>
