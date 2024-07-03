<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import AsideBodyItem from '@/components/LayoutSide/AsideBodyItem.vue';
import EDraggable from '@/components/common/EDraggable.vue';
import type { Project } from '@/core/Project';

const projectStore = useProjectStore();

function onUpdate(p1: Project, p2: Project) {
  [p1.sortIndex, p2.sortIndex] = [p2.sortIndex, p1.sortIndex];
}
</script>
<template>
  <el-scrollbar>
    <e-draggable
      :update="onUpdate"
      :list="projectStore.sortProjects"
      handle="data-side-move"
      class="item-layout"
    >
      <template #default="{ item }">
        <aside-body-item :project="item as Project" :key="item.id" />
      </template>
    </e-draggable>
  </el-scrollbar>
</template>

<style scoped>
.item-layout {
  & > * {
    margin: 0 4px 4px 5px;
  }

  & > *:first-child {
    margin-top: 5px;
  }
}
</style>
