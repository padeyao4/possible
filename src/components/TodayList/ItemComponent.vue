<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import { computed } from 'vue';
import { Node } from '@/core';
import CheckButton from '@/components/common/CheckButton.vue';
import DraggableIcon from '@/components/icon/DraggableIcon.vue';
import { useCursor } from '@/stores/cursor';

const { node } = defineProps<{
  node: Node;
}>();

const projectStore = useProjectStore();

const project = projectStore.getProjectById(node.projectId);

const textDecoration = computed(() => (node.completed ? 'line-through' : 'none'));

const taskName = computed(() => (node.name.trim() === '' ? '未命名' : node.name));

const projectName = computed(() => (project?.name?.trim?.() === '' ? '未命名' : project?.name));

const cursor = useCursor();
</script>
<template>
  <div class="item">
    <div class="icon" @click="node.completed = !node.completed">
      <check-button :checked="node.completed" />
    </div>
    <div class="content">
      <div class="side-style">
        {{ taskName }}
      </div>
      <div class="two">
        {{ projectName }}
      </div>
    </div>
    <DraggableIcon
      class="operation"
      data-move
      @pointerenter="cursor.setWithUnlock('pointer')"
      @pointerleave="cursor.setWithUnlock('default')"
    />
  </div>
</template>
<style scoped>
.item {
  display: flex;
  grid-row: 1;
  align-items: center;
  height: 56px;
  background: var(--background-middle-color);
  border-radius: 4px;

  .icon {
    display: flex;
    flex-shrink: 0;
    align-items: start;
    justify-content: center;
    height: 100%;

    & > * {
      width: 24px;
      height: 24px;
      margin: 12px;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;

    .side-style {
      display: flex;
      flex-grow: 1;
      align-items: end;
      height: 28px;
      overflow: hidden;
      white-space: nowrap;
      text-decoration: v-bind(textDecoration);
      text-overflow: ellipsis;
    }

    .two {
      flex-grow: 1;
      height: 28px;
      overflow: hidden;
      font-size: var(--font-small-size);
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .operation {
    flex-shrink: 0;
    width: 24px;
    height: 100%;
    margin: 12px;
  }
}
</style>
