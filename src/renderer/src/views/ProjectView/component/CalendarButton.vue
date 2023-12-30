<script setup lang="ts">
import { IGraph } from '@antv/g6'
import { ref } from 'vue'
import { useProject } from '@renderer/util/project'
import { originIndex } from '@renderer/util/time'
import { PProject } from '@renderer/model';

const props = defineProps<{
  graph: IGraph | undefined
}>()

const project = useProject() as PProject

const date = ref()

function handleBlur(e) {
  e.target.blur()
}

function handleGraph() {
  if (!date.value) return
  const dx =
    (originIndex(date.value) - project.origin) *
      (project.nodeWidth + project.nodeMargin[1] + project.nodeMargin[3]) +
    project.offset.x
  props.graph?.translate(-dx, -project.offset.y)
}
</script>

<template>
  <el-date-picker
    v-model="date"
    style="width: 120px; margin: 0 4px 0 4px; user-select: none"
    type="date"
    placeholder="Pick a day"
    size="small"
    @keydown.enter="(e) => handleBlur(e)"
    @blur="handleGraph"
  />
</template>

<style scoped></style>
