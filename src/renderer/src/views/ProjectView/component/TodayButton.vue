<script setup lang="ts">
import { Local } from '@icon-park/vue-next'
import { IGraph } from '@antv/g6'
import Tip from '@renderer/component/Tip.vue'
import { useStore } from '@renderer/store/project'
import { useProject } from '@renderer/util/project'
import { PProject } from '@renderer/model'

const props = defineProps<{
  graph: IGraph | undefined
}>()

const store = useStore()
const project = useProject() as PProject

const today = () => {
  const dx =
    (store.dn - project.origin) *
      (project.nodeWidth + project.nodeMargin[1] + project.nodeMargin[3]) +
    project.offset.x
  props.graph?.translate(-dx, -project.offset.y)
}
</script>

<template>
  <tip content="返回今天">
    <local
      theme="outline"
      size="20"
      fill="#333"
      :stroke-width="2"
      class="today-button"
      @click="today"
    />
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
