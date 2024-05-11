<script setup lang="ts">
import { computed } from 'vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import { useState } from '@/stores/state'
import { linkTo } from '@/stores/service/route-service'
import { useSettings } from '@/stores/settings'
import AsideBodyItem from '@/components/AsideBodyItem.vue'

const { projectMap } = useState()
const settings = useSettings()

const list = computed(() => {
  return Array.from(projectMap.values()).sort((p1, p2) => p1.sortIndex - p2.sortIndex)
})

function onstart() {
  // todo
}

function onend() {
  // todo
}

function onupdate() {
  list.value.forEach((value, index) => {
    value.sortIndex = index
  })
}

function onclick(projectId: string) {
  setTimeout(() => {
    linkTo('/project/' + projectId)
  })
}

</script>
<template>
  <draggable :list="list"
             id="aside-body"
             item-key="id"
             chosenClass="chosen-class"
             dragClass="drag-class"
             handle=".move"
             ghostClass="ghost-class"
             :forceFallback="true"
             animation="300"
             @start="onstart"
             @end="onend"
             @update="onupdate">
    <template #item="{ element }">
      <aside-body-item :project="element" :key="element.id" />
    </template>
  </draggable>
</template>

<style scoped>
#aside-body {
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
}
</style>