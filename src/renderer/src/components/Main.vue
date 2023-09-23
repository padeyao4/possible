<script setup lang="ts">
import NewProjectButton from '@renderer/components/NewProjectButton.vue'
import SideListItem from '@renderer/components/SideListItem.vue'
import router from '@renderer/router'
import { useGlobalStore } from '@renderer/store/global'
import { RouterView } from 'vue-router'

const store = useGlobalStore()

const handleTodayClick = () => {
  store.active = 'today'
  router.push({
    name: 'home',
    replace: true
  })
}
</script>

<template>
  <div class="main">
    <div class="body">
      <div class="side">
        <div class="today" :class="{ active: store.active === 'today' }" @click="handleTodayClick">
          我的一天
        </div>
        <hr />
        <side-list-item />
        <hr />
        <new-project-button />
      </div>
      <div class="content">
        <router-view></router-view>
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
      .active {
        background: var(--color-neptune);
      }
    }

    .content {
      width: 100%;
    }
  }
}
</style>
