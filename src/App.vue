<script setup lang="ts">
import router from '@/router'
import { type Project, useStore } from '@/stores/store'
import { DeleteFour, Drag, ListSuccess, Plus, Sun, Write,Config } from '@icon-park/vue-next'
import { useLoadData } from '@/utils/data-util'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Draggable from 'vuedraggable/src/vuedraggable'
import WindowTitlebar from '@/components/WindowTitlebar.vue'
import { useSettings } from '@/stores/settings'

const settings = useSettings()
const route = useRoute()
const store = useStore()
const { isActive } = store

useLoadData()

const projects = computed({
  get: () => {
    return Object.values(store.projects)
      .filter(project => project.completed === false)
      .sort((p1, p2) => p1.sortIndex - p2.sortIndex)
  },
  set: () => {
  }
})

function onUpdateSort() {
  projects.value.forEach((value, index) => {
    value.sortIndex = index
  })
}

function createProject() {
  const id = store.createProject()
  linkTo(`/project/${id}`)
}

function handleInputRef(e: any) {
  setTimeout(() => {
    e?.focus()
  })
}

onMounted(() => {
  linkTo('/today')
})

function handleComplete(evt: any, element: any) {
  evt.stopPropagation()
  element.completed = true
  linkTo('/completed')
}

function linkTo(uri: string) {
  store.setSelected(uri)
  router.push(uri)
}

const count = computed(() => {
  return store.currentTasks.filter(task => !task.data.completed).length
})

const isMaximized = computed(() => {
  return import.meta.env?.VITE_TITLEBAR === 'true' && settings.isMaximize
})

function onCheckInputSubmit(model: Project) {
  if (model.name.trim() === '') {
    model.name = '无标题列表'
  }
  model.editable = false
}

</script>

<template>
  <main @contextmenu.prevent :class="{'maximize-window':isMaximized}">
    <window-titlebar />
    <aside>
      <header>
        <div :class="['selected-item','today-layout', { selected: isActive('/today') }]"
             @click="linkTo('/today')">
          <div class="today-content">
            <sun theme="multi-color" size="20" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="3"
                 strokeLinecap="butt" class="item-icon" />
            我的一天
          </div>
          <div v-if="count!==0" class="counter-icon">{{ count }}</div>
        </div>
        <div :class="['selected-item', { selected: isActive('/completed') }]"
             @click="linkTo('/completed')">
          <list-success theme="outline" size="20" fill="#333" :strokeWidth="3" strokeLinecap="butt"
                        class="item-icon" />
          已完成项目
        </div>
      </header>
      <div id="body">
        <draggable :list="projects" item-key="id" chosenClass="chosen-class" dragClass="drag-class" handle=".move"
                   ghostClass="ghost-class" :forceFallback="true" @update="onUpdateSort">
          <template #item="{ element }">
            <div @click="linkTo(`/project/${element.id}`)"
                 :class="['selected-item', { selected: isActive(`/project/${element.id}`) }]"
                 :key="element.id">
              <input v-if="element.editable && isActive(`/project/${element.id}`)" :ref="handleInputRef"
                     v-model="element.name" @blur="onCheckInputSubmit(element)"
                     @keydown.enter="onCheckInputSubmit(element)" />
              <div v-else class="project-item">
                <div class="info">{{ element.name }}</div>
                <div class="operation">
                  <write theme="outline" size="15" fill="#333" :strokeWidth="1" @click="element.editable = true" />
                  <delete-four theme="outline" size="15" fill="#333" :strokeWidth="1"
                               @click="(evt: any) => handleComplete(evt, element)" />
                  <drag theme="outline" size="15" fill="#b9b9b9" :strokeWidth="1" class="move" />
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
      <footer>
        <div @click="createProject" class="selected-item create-button">
          <plus theme="multi-color" size="20" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="3"
                strokeLinecap="butt" class="item-icon" />
          新建项目
        </div>
        <div :class="['selected-item', 'settings-button', { 'selected': isActive('/settings') }]"
             @click="linkTo('/settings')">
          <config theme="outline" size="24" fill="#333" :strokeWidth="2" class="setting-icon" />
        </div>
      </footer>
    </aside>
    <section>
      <router-view :key="route.fullPath" />
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  background: var(--background);
  border-radius: 8px;
  overflow: hidden;
}

.maximize-window {
  border-radius: 0;
}

aside {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 240px;
  height: 100vh;
  padding-top: 24px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

header {
  flex-shrink: 0;
  padding: 2px 8px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

#body {
  flex-grow: 1;
  padding: 2px 8px;
  overflow-y: auto;
}

footer {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(27, 31, 35, 0.06) 0 -1px 0,
  rgba(255, 255, 255, 0.25) 0 -1px 0 inset;
}

.selected-item {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 4px 0;
  padding: 0 4px;
  width: 100%;
  user-select: none;

  &:hover {
    border-radius: 4px;
    background: var(--active);
  }

  &:hover .operation {
    display: flex;
  }
}

.selected {
  border-radius: 4px;
  background: var(--active);
}

section {
  display: flex;
  flex-grow: 1;
  background: #fdfdfd;
  box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px;
  border-radius: 8px 0 0 0;
  overflow: hidden;
}

input {
  outline-style: none;
  user-select: auto;
  border: 0;
  margin-left: 4px;
  font-size: 15px;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
}

.project-item {
  display: flex;
  width: 100%;

  .info {
    flex-grow: 1;
    margin: 0 4px 0 4px;
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

    .move {
      &:hover {
        cursor: grab;
      }
    }
  }
}

.create-button {
  margin: 2px 0 2px 4px;
}

.settings-button {
  width: 40px;
  margin-right: 4px;
}

.setting-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
}

.item-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px 8px 4px 4px;
}

.counter-icon {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  align-items: center;
  background: rgba(0, 0, 0, 0.06);
  margin: 4px;
  width: 20px;
  height: 20px;
  font-size: 12px;
  border-radius: 50%;
}

.today-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.today-layout {
  display: flex;
}

:deep(.icon) {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>