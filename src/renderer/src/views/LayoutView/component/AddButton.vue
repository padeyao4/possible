<script setup lang="ts">

import {Plus} from "@icon-park/vue-next";
import router from "@renderer/router";
import {useStore} from "@renderer/store/project";
import {Possible} from "@renderer/model";

const store = useStore()

function createProject() {
  const project = new Possible.Project('新建项目')
  project.renaming = true
  store.set(project)
  router.push({
    path: `/project/${project.id}`
  })
}

</script>

<template>
  <div class="add-button" @click="createProject">
    <plus theme="filled" size="24" fill="#333" :strokeWidth="2"
          style="display: flex;justify-content: center; align-items: center" class="icon"/>
    <div style="padding: 0 0 2px 4px">新建项目</div>
  </div>
</template>

<style scoped>
.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  width: 200px;
  height: 100%;
  box-shadow: rgba(27, 31, 35, 0.06) 1px 0 0,
  rgba(255, 255, 255, 0.25) 1px 0 0 inset;

  &:hover .icon {
    animation: turn 0.3s linear;
  }
}

@keyframes turn {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(90deg);
  }
}
</style>
