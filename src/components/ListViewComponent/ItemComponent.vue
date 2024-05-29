<script setup lang="ts">
import { useProjects, type Node } from '@/stores/projects'
import { computed, ref } from 'vue'

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
  align-items: center;
  height: 56px;
  margin-bottom: 4px;
  padding: 0 12px;
  overflow-x: hidden;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;

  .icon {
    display: flex;
    flex-shrink: 0;
    align-items: start;
    justify-content: center;
    width: max-content;
    height: 100%;
    padding-top: 10px;
    padding-right: 12px;

    & > * {
      width: 24px;
      height: 24px;
    }
  }

  .content {
    flex-grow: 1;

    .one {
      display: flex;
      align-items: end;
      height: 28px;
      font-size: var(--font-default-size);
      text-decoration: v-bind(textDecoration);
    }

    .two {
      height: 28px;
      font-size: var(--font-small-size);
    }
  }

  .operation {
    flex-shrink: 0;
    width: fit-content;
    width: 24px;
    height: 100%;
  }
}
</style>
