<script setup lang="ts">
import { ref } from 'vue';
import MenuItemEditeButton from '@/components/MenuItemEditeButton.vue';
import MenuItemDeleteButton from '@/components/MenuItemDeleteButton.vue';
import MenuItemDraggableButton from '@/components/MenuItemDraggableButton.vue';
import { useRouter } from 'vue-router';
import type { Plan } from '@/stores';

const { project } = defineProps<{ project: Plan }>();
const router = useRouter();
const showIcon = ref(false);

function onClick() {
  router.push({ name: 'project', query: { id: project.id } });
}
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
      @click="onClick"
    >
      <el-text truncated size="default">{{ project.name }}</el-text>
    </div>
    <div v-show="showIcon" class="flex shrink-0 flex-row">
      <menu-item-edite-button :project="project" />
      <menu-item-delete-button :project="project" />
      <menu-item-draggable-button :project="project" />
    </div>
  </div>
</template>
