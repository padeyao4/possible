<template>
  <div class="main">
    <div class="side">
      <button>
        <RouterLink to="/">
          我的一天
        </RouterLink>
      </button>
      <button>
        <RouterLink to="/summery">
          生活规划
        </RouterLink>
      </button>
      <button>
        <RouterLink to="/test">
          test
        </RouterLink>
      </button>
      <hr/>
      <div class="list">
        <div v-for="item in store.projects">
          <button style="width: 100%;height: 40px;">{{ item }}</button>
        </div>
      </div>
      <button @click="add_project">
        新建项目
      </button>
    </div>
    <div class="content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
import {RouterLink, RouterView} from 'vue-router'
import store from "./store"

function add_project() {
  store.projects.push(store.projects.length + 1)
}

</script>

<style scoped>
.main {
  display: grid;
  width: 100vw;
  grid-template-columns: 240px calc( 100vw - 240px );
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

//.active {
//  color: rgb(45, 126, 167);
//}

//.button {
//  display: flex;
//  justify-content: center;
//  align-items: center;
//  width: 100%;
//  height: 40px;
//  background: rgb(139, 138, 138);
//  cursor: default;
//  -webkit-user-select: none;
//  user-select: none;
//
//  :hover {
//    background: rgb(160, 84, 84);
//  }
//}

.list {
  overflow-y: auto;
  height: calc(100vh - 120px);
}

.content {
  background-color: rgb(73, 57, 57);
  color: antiquewhite;
  height: 100vh;
}
</style>