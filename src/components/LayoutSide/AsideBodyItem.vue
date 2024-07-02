<script setup lang="ts" generic="T extends Project">
import EDialog from '@/components/common/EDialog.vue';
import { useProjectStore } from '@/stores/project';
import { computed, ref } from 'vue';
import type Project from '@/core/Project';
import { Icon } from '@iconify/vue';
import emitter, { BusEvents } from '@/utils/emitter';
import { useRoute } from 'vue-router';
import router from '@/router';

const { project } = defineProps<{ project: Project }>();
const projectStore = useProjectStore();
const { id } = useRoute().query;

const visible = ref(false);

function handleInputRef(e: HTMLElement) {
  setTimeout(() => {
    e?.focus();
  });
}

function handleEdit() {
  project.editable = true;
}

function handleClickDelete(e: Event) {
  visible.value = true;
  e.stopPropagation();
}

function okCallback() {
  const { removeProject } = useProjectStore();
  if (id === project.id) {
    router.push({ name: 'today' });
  }
  removeProject(project.id);
  visible.value = false;
  emitter.emit(BusEvents['project:deleted']);
}

const len = computed(() => projectStore.sortProjects.length);

const suffix = computed(() => (len.value === 0 ? '' : `(${len.value})`));

function handleUpdateEnd() {
  project.editable = false;
  const name = project.name.trim();
  project.name = name === '' ? `无标题项目${suffix.value}` : name;
  emitter.emit(BusEvents['project:updated']);
}

const active = computed(() => id === project.id);
</script>

<template>
  <div class="draggable-item">
    <input
      v-if="project.editable"
      v-model="project.name"
      class="side-list-item project-item"
      :data-active="active"
      @blur="handleUpdateEnd"
      @keydown.enter="handleUpdateEnd"
      :ref="handleInputRef"
    />
    <div
      v-else
      @click="$router.push({ name: 'project', query: { id: project.id } })"
      class="side-list-item project-item"
      data-hover
      :data-active="active"
    >
      <div class="info">{{ project.name ?? '未命名' }}</div>
      <div class="operation" :data-project-id="project.id">
        <Icon icon="iconoir:edit-pencil" @click="handleEdit" />
        <Icon icon="iconoir:trash" @click="handleClickDelete" />
        <Icon icon="iconoir:menu" class="move" data-side-move />
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
          {{ project.name?.trim() ?? '未命名' }}
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
  border-radius: 4px;
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
