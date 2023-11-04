<script setup lang="ts">
import {useProjectStore} from '@renderer/store/project'
import {useTodayStore} from '@renderer/store/day'
import {computed, ref} from 'vue'
import {date2X} from '@renderer/util'
import TitleBar from "@renderer/component/TitleBar.vue";
import {Round,CheckOne} from "@icon-park/vue-next";

const projectStore = useProjectStore()
const todayStore = useTodayStore()

const todos = computed(() => {
  return projectStore.projects
      .map((project) => {
        const x = date2X(todayStore.today, project.initDate)
        return project.tasks.filter(
            (task) => task.x === x && (task.state === 'timeout' || task.state === 'normal')
        )
      })
      .flat()
})

const completed = computed(() => {
  return projectStore.projects
      .map((project) => {
        const x = date2X(todayStore.today, project.initDate)
        return project.tasks.filter(
            (task) => task.x === x && (task.state === 'completed' || task.state === 'discard')
        )
      })
      .flat()
})

const openCompletedRef = ref(false)
</script>
<template>
  <div>
    <div class="main">
      <title-bar/>
      <div class="header">
        <div class="title">我的一天</div>
      </div>
      <div class="body">
        <div>
          <div v-for="task in todos" :key="task.id" class="item">
            <round theme="outline" size="20" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="icon-park"
                   @click="task.state = 'completed'"/>
            {{ task.name }}
          </div>
        </div>
        <div class="completed" @click="openCompletedRef = !openCompletedRef">
          <el-icon style="margin: 0 4px 0 0">
            <ArrowDown v-if="openCompletedRef"/>
            <ArrowRight v-else/>
          </el-icon>
          已完成 {{ completed.length }}
        </div>
        <div v-if="openCompletedRef">
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
      &:hover{
        background: #d1825b;
      }
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

    .completed-item {
      color: #b2b4b4;
    }
  }
}
</style>
