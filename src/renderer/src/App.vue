<script setup lang="ts">
import router from '@renderer/router'
import {RouterView, useRoute} from 'vue-router'
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useProjectStore} from '@renderer/store/project'
import {ElNotification} from 'element-plus'
import {useTodayStore} from '@renderer/store/day'
import {IProject} from '@renderer/store'
import {DAY_OF_MS} from '@renderer/util'
import TitleBar from "@renderer/component/TitleBar.vue"
import {Config, Plus, SunOne} from '@icon-park/vue-next'
import {useSettingsStore} from "@renderer/store/settings";
import {Theme} from "@icon-park/vue-next/es/runtime";

const route = useRoute()
const projectStore = useProjectStore()
const todayStore = useTodayStore()
const settings = useSettingsStore()

const intervalRef = ref()

onMounted(() => {
  if (settings.autoUpdateDate) {
    console.debug('start auto update date')
    intervalRef.value = setInterval(() => {
      // todo 存在时区问题
      const now = Math.floor(new Date().getTime() / DAY_OF_MS)
      const today = Math.floor(todayStore.today.getTime() / DAY_OF_MS)
      if (now !== today) {
        todayStore.update(new Date())
      }
    }, 30_000)
  }
})

onUnmounted(() => {
  if (intervalRef.value !== undefined) clearInterval(intervalRef.value)
})

const activeId = computed(() => {
  return (route.params.id ?? 'default') as string
})

const handleTodayClick = () => {
  router.push({
    name: 'today',
    replace: true
  })
}

const handleItemClick = (id: string) => {
  router.push({
    path: `/project/${id}`,
    replace: true
  })
}

const addButtonClick = () => {
  const projectId = projectStore.createByName('新任务列表')
  inputVisible.value = true
  router.push({
    path: `/project/${projectId}`
  })
}

/**
 * 导出所有项目数据
 */
function exportAllProjects() {
  window.api.exportProject(JSON.parse(JSON.stringify(projectStore.projects)))
}

/**
 * 根据文件格式导入数据
 */
const importProjects = async () => {
  const projects = await window.api.importProject()
  if (projects === 'cancel') {
    return
  }
  const res = projectStore.push(projects)
  ElNotification({
    message: res ? `成功导入` : '导入失败!文件格式异常或项目已存在',
    type: res ? 'success' : 'error',
    offset: 120,
    duration: 3000
  })
}

const inputVisible = ref(false)

const handleInputRef = (e: HTMLInputElement | undefined) => {
  e?.focus()
}

const project = computed<IProject>(() => {
  return projectStore.get(activeId.value)
})

const bottomVisible = ref(true)

const routeKey = computed(() => {
  return route.fullPath
})

const myDayStyle = computed<{ theme: Theme, color: string }>(() => {
  const active = activeId.value === 'default'
  return {
    theme: active ? 'filled' : 'outline',
    color: active ? '#f2b439' : '#333'
  }
})

</script>

<template>
  <div class="main">
    <div class="side">
      <title-bar :show="false"/>
      <div class="my-day">
        <div class="today-content" @click="handleTodayClick">
          <sun-one :theme="myDayStyle.theme" size="20"
                   :fill="myDayStyle.color" :strokeWidth="2"
                   style="margin:0 4px 0 8px;display: flex; justify-content: center; align-items: center "/>
          <div style="display: inline-block; margin:0 8px 0 4px" :style="{color:myDayStyle.color}">
            我的一天
          </div>
        </div>
      </div>
      <div class="list">
        <template v-for="item in projectStore.list" :key="item.id">
          <div
            v-if="!inputVisible || item.id !== activeId"
            class="list-item"
            :class="{ active: item.id === activeId }"
            @click="handleItemClick(item.id)"
          >
            {{ item.name }}
          </div>
        </template>
        <div v-if="inputVisible" class="list-item active">
          <input
            :ref="(e) => handleInputRef(e as HTMLInputElement)"
            v-model="project.name"
            class="item-input"
            @blur="inputVisible = false"
            @keydown.enter="inputVisible = false"
          />
        </div>
      </div>
      <div class="side-bottom">
        <template v-if="bottomVisible">
          <div class="add-button" @click="addButtonClick">
            <plus theme="filled" size="24" fill="#333" :strokeWidth="2"
                  style="display: flex;justify-content: center; align-items: center"/>
            <div style="padding: 0 0 2px 4px">新建项目</div>
          </div>
          <div class="import-button" @click="bottomVisible = false">
            <config theme="outline" size="24" fill="#333" :strokeWidth="2"
                    style="display: flex;justify-content: center;align-items: center; width: 30px;height: 30px"/>
          </div>
        </template>
        <div v-else class="bottom-settings">
          <el-button text @click="importProjects">导入</el-button>
          <el-button text @click="exportAllProjects">导出</el-button>
          <el-button text @click="bottomVisible = true">返回</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view :key="routeKey"/>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: hidden;
  background: var(--color-background);
  border-radius: 8px;
  display: grid;
  width: var(--app-width);
  height: var(--app-height);
  grid-template-columns: var(--side-width) var(--content-width);
  box-shadow: rgba(9, 30, 66, 0.3) 0 1px 1px, rgba(9, 30, 66, 0.25) 0 0 1px 1px;

  .side {
    display: grid;
    grid-template-rows: 24px 40px 1fr 40px;

    .my-day {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-app-region: drag;
      box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;

      .today-content {
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        height: 40px;
        width: max-content;
        -webkit-app-region: no-drag;
      }
    }

    .list {
      height: calc(var(--app-height) - 104px);
      overflow-y: auto;
      box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;

      .list-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        margin: 4px 8px;

        &:hover {
          border-radius: 4px;
          background: var(--color-side-active);
        }

        .item-input {
          outline-style: none;
          box-sizing: content-box;
          text-align: center;
          border: 0;
          font-size: 15px;
          background-color: rgba(0, 0, 0, 0);
        }
      }

    }

    .active {
      border-radius: 4px;
      background: var(--color-side-active);
    }

    .side-bottom {
      height: 100%;
      display: flex;
      flex-direction: row;

      .add-button {
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        width: 200px;
        height: 100%;
      }

      .import-button {
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        width: 40px;
        height: 100%;

        :hover {
          background: antiquewhite;
          border-radius: 8px;
        }
      }

      .bottom-settings {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        padding: 0 8px 0 8px;
      }
    }
  }

  .content {
    width: 100%;
  }
}

/* 滚动条设置 */
::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  width: 2px;
  /* background-color: #1c1c1c; */
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: #585858;
  background-clip: padding-box;
  min-height: 28px;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb:hover {
  width: 6px;
}
</style>
