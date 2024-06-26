<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import { computed } from 'vue';
import Node from '@/core/Node';
import CheckButton from '@/components/common/CheckButton.vue';
import DraggableIcon from '@/components/icon/DraggableIcon.vue';

const props = defineProps<{
  node: Node;
}>();

const { node } = props;

const projectStore = useProjectStore();

const project = projectStore.getProjectById(node.projectId);

const textDecoration = computed(() => {
  return node.completed ? 'line-through' : 'none';
});

function onclick() {
  node.completed = !node.completed;
  node.sortedIndex = -1;
}

const taskName = computed(() => {
  return node.name.trim() === '' ? '未命名' : node.name;
});

const projectName = computed(() => {
  return project?.name?.trim?.() === '' ? '未命名' : project?.name;
});
</script>
<template>
  <div class="item">
    <div class="icon" @click="onclick">
      <check-button :checked="node.completed" />
    </div>
    <div class="content">
      <div class="one">
        {{ taskName }}
      </div>
      <div class="two">
        {{ projectName }}
      </div>
    </div>
    <DraggableIcon class="operation move" />
  </div>
</template>
<style scoped>
.item {
  display: flex;
  grid-row: 1;
  align-items: center;
  height: 56px;
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
