<script setup lang="ts">
import { computed } from 'vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import { useState } from '@/stores/state'
import { linkTo } from '@/stores/service/route-service'
import { useSettings } from '@/stores/settings'

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

function onclick(e: MouseEvent) {
  const el = e.target as HTMLElement
  const path = el.getAttribute('data-path')
  linkTo('/project/' + path)
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
      <div class="move side-list-item" :key="element.id"
           :data-path="element.id" @click="onclick">
        {{ element.name }}
      </div>
    </template>
  </draggable>
</template>

<style scoped>
#aside-body {
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  & > * {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    height: 40px;
    padding: 4px;
    margin: 4px;
    user-select: none;
  }
}
</style>