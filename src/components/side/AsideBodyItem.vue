<script setup lang="ts">
import type { Project } from '@/stores/state'
import { linkTo } from '@/stores/service/route-service'
import { Drag, Write } from '@icon-park/vue-next'
import { useSettings } from '@/stores/settings'

const settings = useSettings()
const props = defineProps<{ project: Project }>()

function onclick(projectId: string) {
  setTimeout(() => {
    linkTo('/project/' + projectId)
  })
}

function onmouseover(projectId: string) {
  const els = document.getElementsByClassName('operation')
  for (let el of els) {
    const elId = el.getAttribute('data-project-id')
    el.toggleAttribute('data-show', elId === projectId)
  }
}

function onmouseleave(projectId: string) {
  const els = document.getElementsByClassName('operation')
  for (let el of els) {
    const elId = el.getAttribute('data-project-id')
    if (elId === projectId) {
      el.toggleAttribute('data-show', false)
    }
  }
}

function handleInputRef(e: HTMLElement) {
  setTimeout(() => {
    e?.focus()
  })
}

function onsubmit() {
  if (props.project.name.trim() === '') {
    props.project.name = '无标题列表'
  }
  props.project.editable = false
}

function handleEdit() {
  props.project.editable = true
}
</script>

<template>
  <div class="draggable-item">
    <input v-if="project.editable"
           v-model="project.name"
           class="side-list-item project-item"
           :data-active="settings.active===project.id"
           @blur="onsubmit"
           @keydown.enter="onsubmit"
           :ref="handleInputRef" />
    <div v-else @click="onclick(project.id)"
         class="side-list-item project-item"
         :data-active="settings.active===project.id"
         @mouseleave="onmouseleave(project.id)"
         @mouseover="onmouseover(project.id)">
      <div class="info"> {{ project.name }}</div>
      <div class="operation" :data-project-id="project.id">
        <write theme="outline" size="15" fill="#333" :strokeWidth="1" @click="handleEdit" />
        <drag theme="outline" size="15" fill="#b9b9b9" :strokeWidth="1" class="move" />
      </div>
    </div>
  </div>
</template>

<style scoped>

.draggable-item {
  display: flex;
  width: 100%;
  padding: 2px 12px;

  &:first-child {
    margin-top: 2px;
    padding: 2px 12px;
  }
}

.project-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 4px;
  width: 100%;
  z-index: 3;
}

input {
  outline-style: none;
  user-select: auto;
  border: 0;
  font-size: 15px;
  text-indent: 4px;
}


.info {
  margin: 0 4px;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hide {
  display: none;
}

.operation {
  display: none;
  align-items: center;
  justify-content: end;
  width: 68px;
  flex-shrink: 0;

  &[data-show] {
    display: flex;
  }

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px;

    &:hover {
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.06);
    }
  }
}
</style>