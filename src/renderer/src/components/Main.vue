<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NewProjectButton from '@renderer/components/NewProjectButton.vue'
import SideListItem from '@renderer/components/SideListItem.vue'
</script>

<template>
  <div class="main">
    <!-- <div class="header">header</div> -->
    <div class="body">
      <div class="side">
        <button>
          <RouterLink :to="{ name: 'home' }"> 我的一天 </RouterLink>
        </button>
        <hr />
        <side-list-item></side-list-item>
        <new-project-button></new-project-button>
      </div>
      <div class="content">
        <!-- <div class="sys-title">
          <div class="sys-button">
            <button>min</button>
            <button>max</button>
            <button>close</button>
          </div>
        </div> -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: hidden;
  /* border-radius: 16px 16px 16px 16px; */
  /* border: 1px black; */
  /* .header {
    height: var(--title-bar-height);
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: drag;
    border-radius: 16px 16px 0 0;
    background-color: whitesmoke;
  } */
  .body {
    display: grid;
    width: 100vw;
    grid-template-columns: var(--side-width) var(--content-width);
    .side {
      display: grid;
      width: var(--side-width);
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
      height: var(--content-height);
      /* .sys-title {
        height: 40px;
        user-select: none;
        -webkit-user-select: none;
        -webkit-app-region: drag;
        background-color: whitesmoke;
        .sys-button {
          margin: 8px 8px 0 0;
          float: right;
        }
      } */
    }
  }
}
</style>
