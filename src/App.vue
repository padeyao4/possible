<script setup lang="ts">
import router from '@/router'
import { type Edge, type Node, useStore } from '@/stores/store'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { v4 } from 'uuid'
import Draggable from 'vuedraggable/src/vuedraggable'
import { DeleteFour, Drag, Write } from '@icon-park/vue-next'
import type { ID } from '@antv/g6'

const route = useRoute()
const store = useStore()

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
    name: 'untitled',
    nodesMap: new Map<ID, Node>(),
    edgesMap: new Map<ID, Edge>(),
    inEdgesMap: new Map<ID, Set<Edge>>(),
    outEdgesMap: new Map<ID, Set<Edge>>(),
    bothEdgesMap: new Map<ID, Set<Edge>>(),
    completed: false,
    sortIndex: projects.value.length + 1,
    editable: true,
    createTime: new Date().valueOf()
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
          <div class="selected-item" :class="{selected: store.isActive('today')}"
               @click="store.setSelected('today');router.push('/today')">我的一天
          </div>
          <div class="selected-item" :class="{selected: store.isActive('completed')}"
               @click="store.setSelected('completed');router.push('/completed')">
            已完成项目
          </div>
        </header>
        <div id="body">
          <draggable :list="projects"
                     item-key="id"
                     chosenClass="chosen-class"
                     dragClass="drag-class"
                     handle=".move"
                     ghostClass="ghost-class"
                     :forceFallback="true"
                     @update="onUpdate">
            <template #item="{ element }">
              <div class="selected-item"
                   @click="store.setSelected(element.id);router.push(`/project/${element.id}`)"
                   :class="{selected: store.isActive(element.id)}"
                   :key="element.id">
                <input v-if="element.editable&&store.isActive(element.id)"
                       :ref="handleInputRef"
                       v-model="element.name"
                       @blur="element.editable=false"
                       @keydown.enter="element.editable=false" />
                <div v-else class="project-item">
                  <div class="info">{{ element.name }}</div>
                  <div class="operation">
                    <write theme="outline" size="15" fill="#333" :strokeWidth="1" @click="element.editable=true" />
                    <delete-four theme="outline" size="15" fill="#333" :strokeWidth="1"
                                 @click="(evt:any)=>handleComplete(evt,element)" />
                    <drag theme="outline" size="15" fill="#b9b9b9" :strokeWidth="1" class="move" />
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <footer class="selected-item" @click="createProject">
          新建项目
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
  padding: 2px 0;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

#body {
  flex-grow: 1;
  padding: 2px 0;
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
  margin: 4px 8px;
  padding: 0 4px;
  user-select: none;

  &:hover {
    border-radius: 4px;
    background: var(--active);
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
  }

  &:hover .operation {
    display: flex;
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


</style>