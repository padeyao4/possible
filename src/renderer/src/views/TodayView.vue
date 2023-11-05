<script setup lang="ts">
import {useProjectStore} from '@renderer/store/project'
import {useTodayStore} from '@renderer/store/day'
import {computed, ref, toRaw} from 'vue'
import {date2X} from '@renderer/util'
import TitleBar from "@renderer/component/TitleBar.vue";
import {CheckOne, Down, Right, Round} from "@icon-park/vue-next";
import Draggable from 'vuedraggable/src/vuedraggable'

const projectStore = useProjectStore()
const todayStore = useTodayStore()

const todos = computed(() => {
  return projectStore.projects
    .map((project) => {
      const x = date2X(todayStore.today, project.initDate)
      return project.data.nodes.filter(
        (task) => task.x === x && (task.state === 'timeout' || task.state === 'normal')
      )
    })
    .flat().sort((n1, n2) => (n1?.orderIndex ?? 0) - (n2?.orderIndex ?? 0))
})

const completed = computed(() => {
  return projectStore.projects
    .map((project) => {
      const x = date2X(todayStore.today, project.initDate)
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
    <div class="main">
      <title-bar/>
      <div class="header">
        <div class="title">我的一天</div>
      </div>
      <div class="body">
        <draggable :list="toRaw(todos)" animation="300" item-key="id" :forceFallback="true" ghost-class="ghost-class"
                   @change="onChange"
                   @start="onStart"
                   @end="onEnd"
                   drag-class="drag-class">
          <!--element 为固定写法-->
          <template #item="{element}">
            <div class="item">
              <round theme="outline" size="20" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="icon-park"
                     @click="element.state = 'completed'"/>
              {{ element.name }}
            </div>
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
            <check-one theme="filled" size="20" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="icon-park"/>
            <del>{{ task.name }}</del>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.main {
  background: var(--color-neptune);
  height: var(--app-height);
  border-radius: 8px 0 0 0;

  .header {
    -webkit-app-region: drag;

    .title {
      display: inline-block;
      font-size: 20px;
      margin-left: 24px;
    }
  }

  .body {
    margin: 16px 24px 24px 24px;

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

    .icon-park {
      margin: 0 8px 0 4px;
      color: #b2b4b4;
      display: flex;
      justify-content: center;
      align-items: center;
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

    .ghost-class {
      opacity: 0;
    }

    .drag-class {
      box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
      opacity: 1 !important;
    }

    .completed-item {
      color: #b2b4b4;
    }
  }
}
</style>
