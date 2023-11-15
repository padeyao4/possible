<script setup lang="ts">
import {IGraph} from "@antv/g6";
import {ref} from "vue";
import {deltaIndex} from "@renderer/util/time";
import {IProject} from "@renderer/model";

const props = defineProps<{
  graph: IGraph | null
  project: IProject
}>()

const date = ref()


function handleBlur(e) {
  e.target.blur()
}

function handleGraph() {
  if (!date.value) return
  const dx = deltaIndex(date.value, props.project.initDate) * (props.project.nodeWidth + props.project.nodeMargin[1] + props.project.nodeMargin[3]) + props.project.offset.x
  props.graph?.translate(-dx, -props.project.offset.y)
}

</script>

<template>
  <el-date-picker
    v-model="date"
    style="width: 120px; margin: 0 4px 0 4px ; user-select: none"
    type="date"
    placeholder="Pick a day"
    size="small"
    @keydown.enter="(e)=>handleBlur(e)"
    @blur="handleGraph"
  />
</template>

<style scoped>

</style>
