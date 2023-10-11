<script setup lang="ts">
import router from '@renderer/router'
import { RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useProjectStore } from '@renderer/store/project'
import { ElNotification } from 'element-plus'

const projectStore = useProjectStore()
const route = useRoute()

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

const importButtonClick = async () => {
  const project = await window.api.importProject()
  console.log('import project', project)
  const res = projectStore.push(project)
  ElNotification({
    message: res ? `成功导入${project?.name}` : '导入失败!文件格式异常或项目已存在',
    type: res ? 'success' : 'error',
    offset: document.body.clientHeight - 120,
    duration: 3000
  })
}

const inputVisible = ref(false)

const handleInputRef = (e: HTMLInputElement | undefined) => {
  e?.focus()
}

const projectTitle = computed<string>({
  get() {
    return projectStore.get(activeId.value).name
  },
  set(name) {
    projectStore.update(activeId.value, { name })
  }
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
              v-model="projectTitle"
              class="item-input"
              @blur="inputVisible = false"
              @keydown.enter="inputVisible = false"
            />
          </div>
        </div>
        <hr />
        <div class="side-bottom">
          <div class="add-button" @click="addButtonClick">
            <el-icon :size="20">
              <Plus />
            </el-icon>
            <div style="padding: 0 0 2px 4px">新建项目</div>
          </div>
          <div class="import-button" @click="importButtonClick">
            <el-icon :size="20" style="width: 100%; height: 100%">
              <Folder />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="content">
        <router-view />
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
        height: calc(100vh - 82px);
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
