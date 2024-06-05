<script setup lang="ts">
import { useProjects } from '@/stores/projects';
import type { Node } from '@/stores/types';
import { computed, ref } from 'vue';

const props = defineProps<{
  node: Node
}>()

const { node } = props

const projects = useProjects()

const project = computed(() => projects.getProject(node.projectId))
const over = ref(false)

const textDecoration = computed(() => {
  return node.completed ? 'line-through' : 'none'
})

const iconStyle = computed(() => {
  if (node.completed) {
    return !over.value ? 'solar:check-circle-linear' : 'solar:record-line-duotone'
  } else {
    return over.value ? 'solar:check-circle-linear' : 'solar:record-line-duotone'
  }
})

function onclick() {
  node.completed = !node.completed
  node.sortedIndex = -1
}
</script>
<template>
  <div class="item">
    <div class="icon" @click="onclick">
      <my-icon :icon="iconStyle" @mouseenter="over = true" @mouseleave="over = false" />
    </div>
    <div class="content">
      <div class="one">
        {{ node.name }}
      </div>
      <div class="two">
        {{ project?.name }}
      </div>
    </div>
    <my-icon icon="iconoir:menu" class="operation move" />
  </div>
</template>
<style scoped>
.item {
  display: flex;
  grid-row: 1;
  align-items: center;
  height: 56px;
  margin-bottom: 4px;
  background: rgba(255, 255, 255, 0.8);
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

    .one {
      display: flex;
      flex-grow: 1;
      align-items: end;
      height: 28px;
      overflow: hidden;
      font-size: var(--font-default-size);
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
    width: fit-content;
    width: 24px;
    height: 100%;
    margin: 12px;
  }
}
</style>
