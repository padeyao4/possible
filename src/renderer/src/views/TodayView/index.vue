<script setup lang="ts">
import {useStore} from '@renderer/store/project'
import {useDateStore} from '@renderer/store/date'
import {computed, ref, toRaw} from 'vue'
import {Down, Right} from "@icon-park/vue-next";
import Draggable from 'vuedraggable/src/vuedraggable'
import {deltaIndex} from "@renderer/util/time";
import {index2X} from "@renderer/util";
import TodoItem from "@renderer/views/TodayView/component/TodoItem.vue";
import TitleBar from "@renderer/component/TitleBar.vue";
import CompletedList from "@renderer/views/TodayView/component/CompletedList.vue";
import TimeLabel from "@renderer/views/TodayView/component/TimeLabel.vue";
import {Possible} from "@renderer/model";
import WelcomeCard from "@renderer/views/TodayView/component/WelcomeCard.vue";
import CreateTaskInput from "@renderer/views/TodayView/component/CreateTaskInput.vue";
import IProject = Possible.IProject;

const store = useStore()
const dateStore = useDateStore()

const todos = computed(() => {
  return store.list.map((project) => {
    const x = index2X(deltaIndex(dateStore.now, project.initDate))
    return project.data.nodes.filter(
      (task) => task.x === x && (task.state === 'timeout' || task.state === 'normal')
    )
  })
    .flat().sort((n1, n2) => (n1?.orderIndex ?? 0) - (n2?.orderIndex ?? 0))
})

const completed = computed(() => {
  return store.list.map((project) => {
    const x = index2X(deltaIndex(dateStore.now, project.initDate))
    return project.data.nodes.filter(
      (task) => task.x === x && (task.state === 'completed' || task.state === 'discard')
    )
  })
    .flat()
})

const projectMap = computed(() => {
  const map = new Map<string, IProject>()
  store.projects.forEach(project => {
    map.set(project.id, project as IProject)
  })
  return map
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

const isEmpty = computed(() => {
  return store.projects.size === 0
})

</script>
<template>
  <div class="today-bg">
    <div class="settings-button" :class="{'welcome-bg':isEmpty}">
      <title-bar :visible="true"/>
      <div class="header">
        <div class="title">我的一天</div>
        <time-label/>
      </div>
      <div class="body">
        <template v-if="isEmpty">
          <welcome-card/>
        </template>
        <template v-else>
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
              <todo-item :element="element" :project-map="projectMap"/>
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
            <completed-list :list="completed" :project-map="projectMap"/>
          </div>
        </template>
      </div>
      <div class="footer">
        <create-task-input/>
      </div>
    </div>
  </div>
</template>
<style scoped>

.today-bg {
  background: var(--color-neptune);
  border-radius: 8px 0 0 0;
}

.welcome-bg {
  background-image: radial-gradient(transparent -50%, var(--color-neptune)), url("@renderer/assets/images/beach.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-blend-mode: normal;
}

.settings-button {
  --drag-h: 24px;
  --title-h: 72px;
  --footer-h: 64px;
  display: grid;
  grid-template-rows: var(--drag-h) var(--title-h) calc(var(--win-height) - var(--drag-h) - var(--title-h) - var(--footer-h)) var(--footer-h);
  border-radius: 8px 0 0 0;

  .header {
    -webkit-app-region: drag;
    display: flex;
    flex-direction: column;
    height: var(--title-h);

    .title {
      display: flex;
      height: 40px;
      justify-items: center;
      align-items: center;
      width: max-content;
      font-size: 20px;
      margin-left: 24px;
    }
  }

  .body {
    margin: 8px 0 8px 0;
    padding: 0 24px 0 24px;
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
  }

  .footer {
    background: rgba(0, 0, 0, 0);
  }
}
</style>
