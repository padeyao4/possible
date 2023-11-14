<script setup lang="ts">

import {Local} from "@icon-park/vue-next";
import {deltaIndex} from "@renderer/util/time";
import {useDateStore} from "@renderer/store/date";
import {IGraph} from "@antv/g6";
import {IProject} from "@renderer/model";

const props = defineProps<{
  project: IProject,
  graph: IGraph | null
}>()

const dateStore = useDateStore()

const today = () => {
  const dx = deltaIndex(dateStore.now, props.project.initDate) * (props.project.nodeWidth + props.project.nodeMargin[1] + props.project.nodeMargin[3]) + props.project.offset.x
  props.graph?.translate(-dx, -props.project.offset.y)
  console.log(props.graph)
}
</script>

<template>
  <local theme="outline" size="20" fill="#333" :strokeWidth="2" @click="today"/>
</template>

<style scoped>

</style>
