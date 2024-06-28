<script setup lang="ts">
import ItemComponent from '@/components/ListViewComponent/ItemComponent.vue';
import { handleNewProject } from '@/service/project.service';
import { useProjectStore } from '@/stores/project';
import { showWeekAndLocalDate, useTimer } from '@/stores/timer';
import { computed, ref } from 'vue';
import draggable from 'vuedraggable';
import ECounterButton from '@/components/common/ECounterButton.vue';

const visible = ref(false);

const timer = useTimer();

const dateTime = computed(() => {
  return showWeekAndLocalDate(timer.localTimestamp);
});

function ondragend() {}

function ondragstart() {}

const projectStore = useProjectStore();

function onupdateTodoList() {
  projectStore.todoList.forEach((item, index) => {
    item.sortedIndex = index;
  });
}

function onupdateCompletedList() {
  projectStore.completedList.forEach((item, index) => {
    item.sortedIndex = index;
  });
}

const showWelcome = computed(() => {
  return projectStore.todoList.length === 0 && projectStore.completedList.length === 0;
});
</script>

<template>
  <div class="home-view">
    <header>
      <div>我的一天</div>
      <div>{{ dateTime }}</div>
    </header>
    <div v-if="showWelcome" class="content empty-class">
      <div>
        <div class="empty-info">今日空闲,享受悠闲时光~</div>
        <div class="empty-next">
          或者开始<i @click="handleNewProject" class="empty-new">新的计划</i>
        </div>
      </div>
    </div>
    <el-scrollbar v-else class="content">
      <draggable
        :list="projectStore.todoList"
        item-key="id"
        chosenClass="chosen-class"
        dragClass="drag-class"
        handle=".move"
        ghostClass="ghost-class"
        :forceFallback="true"
        animation="300"
        @end="ondragend"
        @start="ondragstart"
        class="wrapper-class"
        @update="onupdateTodoList"
      >
        <template #item="{ element }">
          <item-component :node="element" />
        </template>
      </draggable>
      <e-counter-button
        :count="projectStore.completedList.length"
        v-model="visible"
        class="count-class"
      />
      <draggable
        v-if="visible"
        :list="projectStore.completedList"
        item-key="id"
        chosenClass="chosen-class"
        dragClass="drag-class"
        handle=".move"
        ghostClass="ghost-class"
        :forceFallback="true"
        animation="300"
        @end="ondragend"
        @start="ondragstart"
        class="wrapper-class"
        @update="onupdateCompletedList"
      >
        <template #item="{ element }">
          <item-component :node="element" />
        </template>
      </draggable>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.empty-class {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-info {
  color: #00000070;
  font-weight: bold;
  font-size: large;
  font-style: italic;
}

.empty-next {
  margin-top: 8px;
  color: #00000070;
  font-size: 15px;
  font-style: italic;
}

.empty-new {
  margin-left: 2px;
  color: #00000080;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.ghost-class {
  opacity: 0;
}

.drag-class {
  display: flex;
  background: #e5ebef;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
}

.wrapper-class {
  & > * {
    margin: 4px 0;
  }
  & > *:first-child {
    margin-top: 0;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
}

.count-class {
  margin: 4px 0;
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

.content {
  height: 100%;
  padding: 0 24px 24px 24px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
