<script setup lang="ts">
import { ref } from 'vue';
import { type Project } from '@/stores';
import MenuItemEditeButton from '@/components/MenuItemEditeButton.vue';
import MenuItemDeleteButton from '@/components/MenuItemDeleteButton.vue';

defineProps<{ project: Project }>();
const showIcon = ref(false);
</script>

<template>
  <div
    :class="[
      'my-1 flex h-12 w-full flex-row items-center overflow-hidden rounded-md border-gray-200 px-1.5 hover:bg-blue-50',
      { 'bg-blue-50': $route.name === 'project' && $route.query.id === project.id }
    ]"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="flex h-full grow items-center justify-start overflow-hidden pl-1.5"
      @click="$router.push({ name: 'project', query: { id: project.id } })"
    >
      <el-text truncated size="default">{{ project.name }}</el-text>
    </div>
    <div v-show="showIcon" class="flex shrink-0 flex-row">
      <menu-item-edite-button :project="project" />
      <menu-item-delete-button :project="project" />
    </div>
  </div>
</template>
