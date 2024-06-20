<script setup lang="ts">
import EDialog from '@/components/common/EDialog.vue';
import { useProjectStore } from '@/stores/project';
import { useRoute } from '@/stores/route';
import { computed, ref } from 'vue';
import type Project from '@/core/Project';
import { Icon } from '@iconify/vue';

const props = defineProps<{ project: Project }>();
const { project } = props;

const route = useRoute();

const visible = ref(false);

async function onclick(projectId: string) {
  await route.linkTo('project', projectId);
}

function handleInputRef(e: HTMLElement) {
  setTimeout(() => {
    e?.focus();
  });
}

function handleEdit() {
  project.editable = true;
}

function handleDelete(e: Event) {
  visible.value = true;
  e.stopPropagation();
}

function okCallback() {
  const { removeProject, getCurrentProject } = useProjectStore();
  if (getCurrentProject().id === project.id) {
    route.linkTo('today');
  }
  removeProject(project.id);
  visible.value = false;
}

const projectName = computed(() => {
  const name = project.name.trim();
  return name === '' ? '未命名项目' : name;
});

const isActive = computed(() => {
  return route.active.name === 'project' && project.id === route.active.param;
});
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
        <Icon icon="iconoir:edit-pencil" @click="handleEdit" />
        <Icon icon="iconoir:trash" @click="handleDelete" />
        <Icon icon="iconoir:menu" class="move" />
      </div>
    </div>
    <e-dialog
      v-if="visible"
      :ok="okCallback"
      :cancel="
        () => {
          visible = false;
        }
      "
    >
      <div class="slot-container">
        <div>删除</div>
        <div class="text-content">
          {{ project.name }}
        </div>
        <div>项目吗?</div>
      </div>
    </e-dialog>
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

.slot-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 8px;
  overflow: hidden;
  white-space: nowrap;
  & > * {
    font-weight: lighter;
    font-size: 16px;
  }
  .text-content {
    display: block;
    overflow: hidden;
    color: red;
    font-weight: bold;
    font-style: italic;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
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
