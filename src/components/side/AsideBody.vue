<script setup lang="ts">
import { computed, ref } from 'vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import { useProjects } from '@/stores/projects'
import { linkTo } from '@/stores/service/route-service'
import { useSettings } from '@/stores/settings'
import AsideBodyItem from '@/components/side/AsideBodyItem.vue'

const { projectMap } = useProjects()
const settings = useSettings()
const sideBodyRef = ref()

const list = computed(() => {
  return Array.from(projectMap.values()).sort((p1, p2) => p1.sortIndex - p2.sortIndex)
})

function onstart() {
  document.body.style.cursor = 'move'
  const el = sideBodyRef.value.targetDomElement as HTMLElement
  el.toggleAttribute('data-show', true)
  const els = document.getElementsByClassName('project-item')
  for (let el1 of els) {
    el1.classList.remove('side-list-item')
    el1.children[1].classList.remove('operation')
    el1.children[1].classList.add('hide')
  }
}

function onend() {
  const el = sideBodyRef.value.targetDomElement as HTMLElement
  el.toggleAttribute('data-show', false)
  const els = document.getElementsByClassName('project-item')
  for (let el1 of els) {
    el1.classList.add('side-list-item')
    el1.children[1].classList.add('operation')
    el1.children[1].classList.remove('hide')
  }
  document.body.style.cursor = 'default'
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
#aside-body {
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