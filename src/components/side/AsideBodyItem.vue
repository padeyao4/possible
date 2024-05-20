<script setup lang="ts">
import ModeDialog from '@/components/other/ModeDialog.vue'
import { useProjects, type ID, type Project } from '@/stores/projects'
import { linkTo } from '@/stores/service/route.service'
import { useSettings } from '@/stores/settings'
import { computed, ref } from 'vue'

const settings = useSettings()
const props = defineProps<{ project: Project }>()

const { project } = props

const visible = ref(false)

function onclick(projectId: ID) {
  setTimeout(() => {
    linkTo('/index/project/' + projectId)
  })
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
}

const projectName = computed(() => {
  const name = project.name.trim()
  return name === '' ? '未命名项目' : name
})
</script>

<template>
  <div class="draggable-item">
    <input
      v-if="project.editable"
      v-model="project.name"
      class="side-list-item project-item"
      :data-active="settings.active === project.id"
      @blur="project.editable = false"
      @keydown.enter="project.editable = false"
      :ref="handleInputRef"
    />
    <div
      v-else
      @click="onclick(project.id)"
      class="side-list-item project-item"
      data-hover
      :data-active="settings.active === project.id"
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
      删除
      <b
        ><i style="color: red">{{ project.name }}</i></b
      >
      项目吗?
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
