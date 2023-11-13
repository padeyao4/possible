<script setup lang="ts">
import {useProjectStore} from '@renderer/store/project'
import {useDateStore} from '@renderer/store/date'
import {computed, ref, toRaw} from 'vue'
import {CheckOne, Down, Right} from "@icon-park/vue-next";
import Draggable from 'vuedraggable/src/vuedraggable'
import {deltaIndex} from "@renderer/util/time";
import {index2X} from "@renderer/util";
import TodoItem from "@renderer/views/TodayView/TodoItem.vue";
import TitleBar from "@renderer/component/TitleBar.vue";

const projectStore = useProjectStore()
const dateStore = useDateStore()

const todos = computed(() => {
  return projectStore.projects
      .map((project) => {
        const x = index2X(deltaIndex(dateStore.now, project.initDate))
        return project.data.nodes.filter(
            (task) => task.x === x && (task.state === 'timeout' || task.state === 'normal')
        )
      })
      .flat().sort((n1, n2) => (n1?.orderIndex ?? 0) - (n2?.orderIndex ?? 0))
})

const completed = computed(() => {
  return projectStore.projects
      .map((project) => {
        const x = index2X(deltaIndex(dateStore.now, project.initDate))
        return project.data.nodes.filter(
            (task) => task.x === x && (task.state === 'completed' || task.state === 'discard')
        )
      })
      .flat()
})

function onChange() {
  todos.value.forEach((value, index) => {
    value.orderIndex = index
  })
}

let defaultMouseStyle = 'auto'

function onStart() {
  defaultMouseStyle = document.body.style.cursor
  document.body.style.cursor = 'move'
}

function onEnd() {
  document.body.style.cursor = defaultMouseStyle
}

const openCompleted = ref(false)


</script>
<template>
  <div>
    <div class="settings-button">
      <title-bar :visible="true"/>
      <div class="header">
        <div class="title">我的一天</div>
      </div>
      <div class="body">
        <draggable :list="toRaw(todos)" animation="300" item-key="id" :forceFallback="true"
                   @change="onChange"
                   @start="onStart"
                   @end="onEnd"
                   ghost-class="ghost-class"
                   handle=".mover"
                   chosenClass="chosen-class"
                   drag-class="drag-class">
          <!--element 为固定写法-->
          <template #item="{element}">
            <todo-item :element="element"/>
          </template>
        </draggable>
        <div class="completed" @click="openCompleted = !openCompleted">
          <down v-if="openCompleted" theme="outline" size="24" fill="#333" :strokeWidth="2"
                style="display: flex;justify-content: center;align-items: center"/>
          <right v-else theme="outline" size="24" fill="#333" :strokeWidth="2"
                 style="display: flex;justify-content: center;align-items: center"/>
          已完成 {{ completed.length }}
        </div>
        <div v-if="openCompleted">
          <div v-for="task in completed" :key="task.id" class="item completed-item">
            <check-one theme="filled" size="20" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="icon-park"
                       @click="task.state='normal'"/>
            <del>{{ task.name }}</del>
          </div>
        </div>
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>
<style scoped>
.settings-button {
  display: grid;
  grid-template-rows: 24px 40px calc(var(--win-height) - 104px) 40px;
  background: var(--color-neptune);
  border-radius: 8px 0 0 0;

  .header {
    -webkit-app-region: drag;
    display: flex;
    justify-items: center;

    .title {
      display: flex;
      justify-items: center;
      align-items: center;
      width: max-content;
      font-size: 20px;
      margin-left: 24px;
    }
  }

  .body {
    padding: 16px 24px 40px 24px;
    height: calc(var(--win-height) - 64px) !important;
    overflow-y: auto;

    .completed {
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

    .item {
      display: flex;
      align-items: center;
      padding-left: 8px;
      text-align: center;
      background-color: var(--color-side-active);
      width: 100%;
      height: 48px;
      margin: 4px 0 4px 0;
      border-radius: 4px;
    }

    .icon-park {
      margin: 0 8px 0 4px;
      color: #b2b4b4;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .completed-item {
      color: #b2b4b4;

      &:hover {
        background: rgba(255, 255, 255, 0.98);
      }
    }
  }

  .footer {
    height: 40px;
    background: var(--color-neptune);
  }
}
</style>
