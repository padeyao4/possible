<script setup lang="ts">

import {Local} from "@icon-park/vue-next";
import {deltaIndex} from "@renderer/util/time";
import {useDateStore} from "@renderer/store/date";
import {IGraph} from "@antv/g6";
import Tip from "@renderer/component/Tip.vue";
import {PProject} from "@renderer/model";

const props = defineProps<{
  project: PProject,
  graph: IGraph | undefined
}>()

const dateStore = useDateStore()

const today = () => {
  const dx = deltaIndex(dateStore.now, props.project.baseTime) * (props.project.nodeWidth + props.project.nodeMargin[1] + props.project.nodeMargin[3]) + props.project.offset.x
  props.graph?.translate(-dx, -props.project.offset.y)
}
</script>

<template>
  <tip content="返回今天">
    <local theme="outline" size="20" fill="#333" :strokeWidth="2" @click="today" class="today-button"/>
  </tip>
</template>

<style scoped>
.today-button {
  padding: 4px;
  margin: 0 4px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(37, 159, 167, 0.1);
    border-radius: 4px;
  }
}
</style>
