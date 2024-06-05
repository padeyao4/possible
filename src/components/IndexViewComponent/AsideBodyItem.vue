<script setup lang="ts">
import ModeDialog from '@/components/common/ModeDialog.vue'
import { useProjects } from '@/stores/projects'
import { useRoute } from '@/stores/route'
import { computed, ref } from 'vue'
import type { Project } from '@/stores/types'

const props = defineProps<{ project: Project }>()
const { project } = props

const route = useRoute()

const visible = ref(false)

function onclick(projectId: string) {
  route.linkTo('project', projectId)
}

function handleInputRef(e: HTMLElement) {
  setTimeout(() => {
    e?.focus()
  })
}

function handleEdit() {
  project.editable = true
}

function handleDelete() {
  visible.value = true
}

function okCallback() {
  useProjects().removeProject(project.id)
  visible.value = false
  route.linkTo('today')
}

const projectName = computed(() => {
  const name = project.name.trim()
  return name === '' ? '未命名项目' : name
})

const isActive = computed(() => {
  return route.active.name === 'project' && project.id === route.active.param
})
</script>

<template>
  <div class="draggable-item">
    <input
      v-if="project.editable"
      v-model="project.name"
      class="side-list-item project-item"
      :data-active="isActive"
      @blur="project.editable = false"
      @keydown.enter="project.editable = false"
      :ref="handleInputRef"
    />
    <div
      v-else
      @click="onclick(project.id.toString())"
      class="side-list-item project-item"
      data-hover
      :data-active="isActive"
    >
      <div class="info">{{ projectName }}</div>
      <div class="operation" :data-project-id="project.id">
        <my-icon icon="iconoir:edit-pencil" @click="handleEdit" />
        <my-icon icon="iconoir:trash" @click="handleDelete" />
        <my-icon icon="iconoir:menu" class="move" />
      </div>
    </div>
    <mode-dialog
      v-if="visible"
      :ok="okCallback"
      :cancel="
        () => {
          visible = false
        }
      "
    >
      <div class="solt-container">
        <div>删除</div>
        <div class="text-content">
          {{ project.name }}
        </div>
        <div>项目吗?</div>
      </div>
    </mode-dialog>
  </div>
</template>

<style scoped>
.draggable-item {
  display: flex;
  width: 100%;
  padding: 2px 4px;

  &:first-child {
    margin-top: 2px;
  }
}

.solt-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0 8px;
  overflow: hidden;
  white-space: nowrap;
}

.text-content {
  display: block;
  overflow: hidden;
  color: red;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.project-item {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 4px 8px;
}

input {
  font-size: 15px;
  text-indent: 4px;
  border: 0;
  outline-style: none;
  user-select: auto;
}

.info {
  flex-grow: 1;
  margin: 0 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.operation {
  display: none;
  flex-shrink: 0;
  align-items: center;
  justify-content: end;
  width: 68px;
}
</style>
