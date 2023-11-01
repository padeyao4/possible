<script setup lang="ts">
import router from '@renderer/router'
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useProjectStore } from '@renderer/store/project'
import { ElNotification } from 'element-plus'
import { useTodayStore } from '@renderer/store/day'
import { IProject } from '@renderer/store'
import { autoUpdateDate } from '@renderer/settings'
import { DAY_OF_MS } from '@renderer/util'

const projectStore = useProjectStore()
const route = useRoute()
const todayStore = useTodayStore()

const intervalRef = ref()

onMounted(() => {
  if (autoUpdateDate) {
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
const exportAllProjects = () => {
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
</script>

<template>
  <div class="main">
    <div class="body">
      <div class="side">
        <div class="today" :class="{ active: activeId === 'default' }" @click="handleTodayClick">
          <el-icon :size="20">
            <Sunny />
          </el-icon>
          <div style="margin-left: 4px; padding-bottom: 1px">我的一天</div>
        </div>
        <hr />
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
        <hr />
        <div class="side-bottom">
          <template v-if="bottomVisible">
            <div class="add-button" @click="addButtonClick">
              <el-icon :size="20">
                <Plus />
              </el-icon>
              <div style="padding: 0 0 2px 4px">新建项目</div>
            </div>
            <div class="import-button" @click="bottomVisible = false">
              <el-icon :size="20" style="width: 100%; height: 100%">
                <Folder />
              </el-icon>
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
        <router-view :key="routeKey" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: hidden;

  .body {
    display: grid;
    width: 100vw;
    grid-template-columns: var(--side-width) var(--content-width);

    .side {
      width: var(--side-width);
      height: 100vh;
      background: var(--color-bronze);
      color: rgb(66, 66, 66);

      .today {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: antiquewhite;
        text-decoration: none;
        border: 1px black;
        user-select: none;
      }

      .list {
        height: calc(100vh - 84px);
        overflow-y: auto;

        .list-item {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 40px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          user-select: none;

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
        background: var(--color-neptune);
      }

      .side-bottom {
        height: 40px;
        display: flex;
        flex-direction: row;

        .add-button {
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
          background: var(--color-bronze);
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
