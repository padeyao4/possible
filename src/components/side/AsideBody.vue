<script setup lang="ts">
import { computed, ref } from 'vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import { useProjects } from '@/stores/projects'
import AsideBodyItem from '@/components/side/AsideBodyItem.vue'
import { useMouseStyle } from '@/stores/mouse'

const { projectMap } = useProjects()
const sideBodyRef = ref()

const list = computed(() => {
  return Array.from(projectMap.values()).sort((p1, p2) => p1.sortIndex - p2.sortIndex)
})

function onstart() {
  const mouseStyle = useMouseStyle()
  mouseStyle.lockStyle('move')
  const els = document.getElementsByClassName('side-list-item')
  for (let el of els) {
    el.toggleAttribute('data-hover', false)
  }
}

function onend() {
  const mouseStyle = useMouseStyle()
  mouseStyle.unlock()
  const els = document.getElementsByClassName('side-list-item')
  for (let el of els) {
    el.toggleAttribute('data-hover', true)
  }
  mouseStyle.setStyleWithUnlock('default')
}

function onupdate() {
  list.value.forEach((value, index) => {
    value.sortIndex = index
  })
}

</script>
<template>
  <draggable :list="list"
             class="aside-body"
             ref="sideBodyRef"
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
.aside-body {
  flex-direction: column;
  overflow-y: auto;
  width: 100%;

  &[data-show]::before {
    position: fixed;
    content: '';
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    opacity: 0;
  }
}
</style>