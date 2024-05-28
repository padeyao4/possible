<script setup lang="ts">
import ItemComponent from '@/components/ListViewComponent/ItemComponent.vue'
import { type Node } from '@/stores/projects'
import { timeFormat, useTimer } from '@/stores/timer'
import { computed, inject, ref, type Ref } from 'vue'
import draggable from 'vuedraggable'

const todoList = inject<Ref<Node[]>>('todoList')

const completedList = inject<Ref<Node[]>>('completedList')

const visible = ref(false)

const timer = useTimer()

const dateTime = computed(() => {
  return timeFormat.format(timer.localTimestamp) + ' 星期' + new Date(timer.localTimestamp).getDay()
})

function ondragend() {}

function ondragstart() {}

function onupdate() {}
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
        @update="onupdate"
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
        @update="onupdate"
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
    font-size: 20px;
  }

  & div:nth-child(2) {
    color: rgba(0, 0, 0, 0.8);
    font-weight: 300;
    font-size: 14px;
  }
}

main {
  height: 100%;
  padding: 0 24px 24px 24px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
