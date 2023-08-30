<script setup lang="ts">
import {RouterLink, RouterView} from "vue-router";
import router from "@/router/index";
import {useGlobalStore} from "@/store/global";
import NewProjectButton from "@/components/NewProjectButton.vue";

const store = useGlobalStore()

function handleClick(id: string) {
  router.push({
    name: 'summery',
    replace: true
  })
  store.$patch({active: id})
}
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
      <div class="list">
        <button v-for="item in store.projects"
                @click="()=>handleClick(item.id)"
                :class="{active:item.id===store.active,it:true}"
                :key="item.id">
          {{ item.name }}
        </button>
      </div>
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

  .list {
    overflow-y: auto;
    height: calc(100vh - 120px);

    .it {
      width: 100%;
      height: 40px;
    }

    .active {
      background-color: burlywood;
    }
  }
}


.content {
  background-color: rgb(73, 57, 57);
  height: 100vh;
}
</style>