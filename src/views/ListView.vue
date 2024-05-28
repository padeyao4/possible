<script setup lang="ts">
import { useProjects } from '@/stores/projects';
import { getIndexByDate } from '@/stores/timer';
import { computed, ref } from 'vue';
import draggable from 'vuedraggable';
import ItemComponent from '@/components/ListViewComponent/ItemComponent.vue';

const projects = useProjects()

const nodes = computed(() => {
  return Array.from(projects.projectMap.values()).map(project => {
    const curX = getIndexByDate(project)
    const { nodeMap } = project
    return Array.from(nodeMap.values()).filter(node => {
      return node.x <= curX && curX < node.x + node.width
    })
  }).flat()
})

const todoList = computed(() => {
  return nodes.value.filter(node => node.completed === false)
})

const completedList = computed(() => {
  return nodes.value.filter(node => node.completed === true)
})

const visible = ref(false)

function ondragend() {

}

function ondragstart() {

}

function onupdate() {

}
</script>

<template>
  <div id="home-view">
    <header data-tauri-drag-region>
      <div data-tauri-drag-region>我的一天</div>
      <div data-tauri-drag-region>2024/5/28 星期2</div>
    </header>
    <main>
      <draggable :list="todoList" item-key="id" chosenClass="chosen-class" dragClass="drag-class" handle=".move"
        ghostClass="ghost-class" :forceFallback="true" animation="300" @end="ondragend" @start="ondragstart"
        class="todo-class" @update="onupdate">
        <template #item="{ element }">
          <item-component :node="element" />
        </template>
      </draggable>
      <div class="show-button" v-if="completedList.length > 0" @click="visible = !visible">
        <my-icon :icon="visible ? 'solar:alt-arrow-down-bold' : 'solar:alt-arrow-right-bold'" />
        已完成 {{ completedList.length }}
      </div>
      <draggable v-if="visible" :list="completedList" item-key="id" chosenClass="chosen-class" dragClass="drag-class"
        handle=".move" ghostClass="ghost-class" :forceFallback="true" animation="300" @end="ondragend"
        @start="ondragstart" class="todo-class" @update="onupdate">
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
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  background: #e5ebef;
}

.show-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  height: 32px;
  width: max-content;
  margin: 8px 0 8px 0;
  text-align: center;
  padding: 0 8px;
  user-select: none;
}

#home-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #82bbb5;
  overflow: hidden;
}

header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 58px;
  flex-shrink: 0;
  margin: 24px 24px 12px 24px;
  overflow-y: hidden;

  &>* {
    display: flex;
    align-items: center;
  }

  & div:first-child {
    font-size: 20px;
  }

  & div:nth-child(2) {
    font-size: 14px;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.8);
  }
}

main {
  padding: 0 24px 24px 24px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
