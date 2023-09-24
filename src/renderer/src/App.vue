<script setup lang="ts">
import { registerBehaviors } from '@renderer/g6'
import { useGlobalStore } from '@renderer/store/global'
import NewProjectButton from '@renderer/components/NewProjectButton.vue'
import router from '@renderer/router'
import { RouterView } from 'vue-router'

const store = useGlobalStore()
store.$hydrate()
registerBehaviors()

const handleTodayClick = () => {
  store.active = 'today'
  router.push({
    name: 'home',
    replace: true
  })
}

const handleItemClick = (id: string) => {
  router.push({
    name: 'summery',
    replace: true
  })
  store.$patch({ active: id })
}
</script>

<template>
  <div class="main">
    <div class="body">
      <div class="side">
        <div class="today" :class="{ active: store.active === 'today' }" @click="handleTodayClick">
          <el-icon :size="20">
            <Sunny />
          </el-icon>
          <div style="margin-left: 4px; padding-bottom: 1px">我的一天</div>
        </div>
        <hr />
        <div class="list">
          <div
            v-for="item in store.projects"
            :key="item.id"
            class="list-item"
            :class="{ active: item.id === store.active }"
            @click="handleItemClick(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <hr />
        <new-project-button />
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
        }
      }

      .active {
        background: var(--color-neptune);
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
