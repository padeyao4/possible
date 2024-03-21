<script setup lang="ts">
import router from '@/router'
import { type Edge, type Node, useStore } from '@/stores/store'
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { v4 } from 'uuid'
import Draggable from 'vuedraggable/src/vuedraggable'
import { DeleteFour, Drag, Write } from '@icon-park/vue-next'
import type { ID } from '@antv/g6'
import { faker } from '@faker-js/faker'
import { Config } from "@icon-park/vue-next";
// import SettingsButton from '@/components/SettingsButton.vue'

const route = useRoute()
const store = useStore()

const timer = ref()

/**
 * Schedules a task to run at midnight every day. 
 * Calculates the delay until midnight, sets a timeout 
 * to call store.updateTime() and store.dailyUpdate(), 
 * then recursively schedules another call to this function 
 * at the next midnight.
 */
function scheduleMidnightTask() {
  const now: Date = new Date();
  const midnight: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const delay: number = midnight.getTime() - now.getTime();

  timer.value = setTimeout(() => {
    store.updateTime()
    store.dailyUpdate()
    // 设置下一个午夜的定时器
    scheduleMidnightTask();
  }, delay);
}

onBeforeMount(() => {
  store.updateTime()
  store.dailyUpdate()
  scheduleMidnightTask()
})

onUnmounted(() => {
  clearTimeout(timer.value)
})

const projects = computed({
  get: () => {
    return Object.values(store.projects)
      .filter(project => project.completed === false)
      .sort((p1, p2) => p1.sortIndex - p2.sortIndex)
  },
  // 空函数用于消除告警
  set: () => {
  }
})

function onUpdate() {
  projects.value.forEach((value, index) => {
    value.sortIndex = index
  })
}

function createProject() {
  const id = store.addProject({
    id: v4(),
    name: faker.finance.currencyName(),
    nodesMap: new Map<ID, Node>(),
    edgesMap: new Map<ID, Edge>(),
    inEdgesMap: new Map<ID, Set<Edge>>(),
    outEdgesMap: new Map<ID, Set<Edge>>(),
    rowsMap: new Map<ID, Set<Node>>(),
    colsMap: new Map<ID, Set<Node>>(),
    coordinateMap: new Map<string, Node>(),
    completed: false,
    sortIndex: projects.value.length + 1,
    editable: true,
    createTime: faker.date.between({ from: '1900/1/1', to: '2024/3/20' }).valueOf()
  })
  store.setSelected(id)
  router.push(`/project/${id}`)
}

function handleInputRef(e: any) {
  setTimeout(() => {
    e?.focus()
  })
}

onMounted(() => {
  store.setSelected('today')
  router.push('/today')
})

function handleComplete(evt: any, element: any) {
  evt.stopPropagation()
  element.completed = true
  store.setSelected('completed')
  router.push('/completed')
}

</script>

<template>
  <div>
    <main @contextmenu.prevent>
      <aside>
        <header>
          <div :class="['selected-item', { selected: store.isActive('today') }]"
            @click="store.setSelected('today'); router.push('/today')">我的一天
          </div>
          <div :class="['selected-item', { selected: store.isActive('completed') }]"
            @click="store.setSelected('completed'); router.push('/completed')">
            已完成项目
          </div>
        </header>
        <div id="body">
          <draggable :list="projects" item-key="id" chosenClass="chosen-class" dragClass="drag-class" handle=".move"
            ghostClass="ghost-class" :forceFallback="true" @update="onUpdate">
            <template #item="{ element }">
              <div @click="store.setSelected(element.id); router.push(`/project/${element.id}`)"
                :class="['selected-item', { selected: store.isActive(element.id) }]" :key="element.id">
                <input v-if="element.editable && store.isActive(element.id)" :ref="handleInputRef"
                  v-model="element.name" @blur="element.editable = false" @keydown.enter="element.editable = false" />
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
          <div @click="createProject" class="selected-item create-button">新建项目</div>
          <div :class="['selected-item', 'settings-button', { 'selected': store.isActive('settings') }]" @click="() => {
            store.setSelected('settings')
            router.push('/settings')
          }
            ">
            <config theme="outline" size="24" fill="#333" :strokeWidth="2" class="icon" />
          </div>
        </footer>
      </aside>
      <section>
        <router-view :key="route.fullPath" id="content" />
      </section>
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  background: var(--background);
}

aside {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 240px;
  height: 100vh;
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
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

footer {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
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

#content {
  flex-grow: 1;
}

input {
  outline-style: none;
  user-select: auto;
  border: 0;
  font-size: 15px;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
}

.project-item {
  display: flex;
  width: 100%;

  .info {
    display: flex;
    align-items: center;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
  }

  .operation {
    display: none;
    align-items: center;
    justify-content: end;
    width: 68px;
    flex-shrink: 0;

    &>* {
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

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
}
</style>