<script setup lang="ts">
import {RouterLink, RouterView} from "vue-router";
import NewProjectButton from "@renderer/components/NewProjectButton.vue";
import SideListItem from "@renderer/components/SideListItem.vue";
</script>

<template>
  <div class="main">
    <div class="side">
      <button>
        <RouterLink :to="{name: 'home'}">
          我的一天
        </RouterLink>
      </button>
      <hr/>
      <side-list-item></side-list-item>
      <new-project-button></new-project-button>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: grid;
  width: 100vw;
  grid-template-columns: var(--side-width) var(--content-width);
}

.side {
  display: grid;
  background: rgb(99, 94, 94);
  color: rgb(124, 97, 97);

  & hr {
    height: 1px;
    border: none;
    border-top: 1px solid #323232;
  }
}

.content {
  background-color: rgb(73, 57, 57);
  height: 100vh;
}
</style>
