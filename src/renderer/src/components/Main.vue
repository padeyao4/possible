<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NewProjectButton from '@renderer/components/NewProjectButton.vue'
import SideListItem from '@renderer/components/SideListItem.vue'
</script>

<template>
  <div class="main">
    <div class="body">
      <div class="side">
        <RouterLink :to="{ name: 'home' }" class="today"> 我的一天 </RouterLink>
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
      /* display: grid; */
      width: var(--side-width);
      height: 100vh;
      background: var(--color-bronze);
      color: rgb(66, 66, 66);

      .today {
        width: 100%;
        height: 40px;
        background: rgba(0, 0, 0, 0);
        display: flex;
        justify-content: center;
        align-items: center;
        color: antiquewhite;
        text-decoration: none;
        border: 1px black;
      }
    }

    .content {
      background-color: rgb(73, 57, 57);
      height: var(--content-height);
    }
  }
}
</style>
