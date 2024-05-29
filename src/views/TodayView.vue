<script setup lang="ts">
import ItemComponent from '@/components/ListViewComponent/ItemComponent.vue'
import { useProjects } from '@/stores/projects'
import { getIndexByDate, timeFormat, useTimer } from '@/stores/timer'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'

const projects = useProjects()
const visible = ref(false)

const timer = useTimer()

const dateTime = computed(() => {
  return timeFormat.format(timer.localTimestamp) + ' 星期' + new Date(timer.localTimestamp).getDay()
})

const nodes = computed(() => {
  console.log('update-nodes')
  return Array.from(projects.projectMap.values())
    .map((project) => {
      const curX = getIndexByDate(project)
      const { nodeMap } = project
      return Array.from(nodeMap.values()).filter((node) => {
        return node.x <= curX && curX < node.x + node.width
      })
    })
    .flat()
})

const todoList = computed(() => {
  console.log('todoList')
  return nodes.value
    .filter((node) => node.completed === false)
    .sort((a, b) => {
      return a.sortedIndex - b.sortedIndex
    })
})

const completedList = computed(() => {
  console.log('completedList')
  return nodes.value
    .filter((node) => node.completed === true)
    .sort((a, b) => {
      return a.sortedIndex - b.sortedIndex
    })
})

function ondragend() {}

function ondragstart() {}

function onupdateTodoList() {
  console.log('update todo list')
  todoList.value.forEach((item, index) => {
    item.sortedIndex = index
  })
}

function onupdateCompletedList() {
  console.log('update completed list')
  completedList.value.forEach((item, index) => {
    item.sortedIndex = index
  })
}
</script>

<template>
  <div id="home-view">
    <header data-tauri-drag-region>
      <div data-tauri-drag-region>我的一天</div>
      <div data-tauri-drag-region>{{ dateTime }}</div>
    </header>
    <main>
      <draggable
        :list="todoList"
        item-key="id"
        chosenClass="chosen-class"
        dragClass="drag-class"
        handle=".move"
        ghostClass="ghost-class"
        :forceFallback="true"
        animation="300"
        @end="ondragend"
        @start="ondragstart"
        class="todo-class"
        @update="onupdateTodoList"
      >
        <template #item="{ element }">
          <item-component :node="element" />
        </template>
      </draggable>
      <div class="show-button" v-if="completedList.length > 0" @click="visible = !visible">
        <my-icon :icon="visible ? 'solar:alt-arrow-down-bold' : 'solar:alt-arrow-right-bold'" />
        已完成 {{ completedList.length }}
      </div>
      <draggable
        v-if="visible"
        :list="completedList"
        item-key="id"
        chosenClass="chosen-class"
        dragClass="drag-class"
        handle=".move"
        ghostClass="ghost-class"
        :forceFallback="true"
        animation="300"
        @end="ondragend"
        @start="ondragstart"
        class="todo-class"
        @update="onupdateCompletedList"
      >
        <template #item="{ element }">
          <item-component :node="element" />
        </template>
      </draggable>
    </main>
  </div>
</template>

<style scoped>
.ghost-class {
  opacity: 0;
}

.drag-class {
  background: #e5ebef;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
}

.show-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: 32px;
  margin: 8px 0 8px 0;
  padding: 0 8px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  user-select: none;
}

#home-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #82bbb5;
}

header {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  height: 58px;
  margin: 24px 24px 12px 24px;
  overflow-y: hidden;

  & > * {
    display: flex;
    align-items: center;
  }

  & div:first-child {
    font-size: var(--font-large-size);
  }

  & div:nth-child(2) {
    font-size: var(--font-small-size);
    font-weight: var(--font-light-weight);
  }
}

main {
  height: 100%;
  padding: 0 24px 24px 24px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
