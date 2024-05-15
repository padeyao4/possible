<script setup lang="ts">
import type { ID, Project } from '@/stores/projects'
import { linkTo } from '@/stores/service/route-service'
import { useSettings } from '@/stores/settings'

const settings = useSettings()
const props = defineProps<{ project: Project }>()

function onclick(projectId: ID) {
  setTimeout(() => {
    linkTo('/project/' + projectId)
  })
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
         data-hover
         :data-active="settings.active===project.id"
    >
      <div class="info"> {{ project.name }}</div>
      <div class="operation" :data-project-id="project.id">
        <Icon icon="iconoir:edit-pencil" @click="handleEdit" />
        <Icon icon="iconoir:menu" class="move" />
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

.operation {
  display: none;
  align-items: center;
  justify-content: end;
  width: 68px;
  flex-shrink: 0;
}
</style>