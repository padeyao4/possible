<script setup lang="ts">
import ModeDialog from '@/components/other/ModeDialog.vue'
import { useProjects, type Project } from '@/stores/projects'
import { useRoute } from '@/stores/route'
import { computed, ref } from 'vue'

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
  padding: 4px 8px;
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
