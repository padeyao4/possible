<script setup lang="ts">
import ItemComponent from '@/components/ListViewComponent/ItemComponent.vue'
import { useProjects } from '@/stores/projects'
import { showWeekAndLocalDate, useTimer } from '@/stores/timer'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'

const visible = ref(false)

const timer = useTimer()

const dateTime = computed(() => {
  return showWeekAndLocalDate(timer.localTimestamp)
})

function ondragend() {}

function ondragstart() {}

const projects = useProjects()

function onupdateTodoList() {
  projects.todoList.forEach((item, index) => {
    item.sortedIndex = index
  })
}

function onupdateCompletedList() {
  projects.completedList.forEach((item, index) => {
    item.sortedIndex = index
  })
}
</script>

<template>
  <div class="home-view">
    <header>
      <div>我的一天</div>
      <div>{{ dateTime }}</div>
    </header>
    <main>
      <draggable
        :list="projects.todoList"
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
      <div class="show-button" v-if="projects.completedList.length > 0" @click="visible = !visible">
        <my-icon :icon="visible ? 'solar:alt-arrow-down-bold' : 'solar:alt-arrow-right-bold'" />
        已完成 {{ projects.completedList.length }}
      </div>
      <draggable
        v-if="visible"
        :list="projects.completedList"
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
  display: flex;
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

.home-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #82bbb5 !important;
}

header {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  height: 58px;
  padding: 36px 24px;
  overflow-y: hidden;

  & > * {
    display: flex;
    align-items: center;
  }

  & div:first-child {
    font-size: var(--font-large-size);
  }

  & div:nth-child(2) {
    font-weight: var(--font-light-weight);
    font-size: var(--font-small-size);
  }
}

main {
  height: 100%;
  padding: 0 24px 24px 24px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
