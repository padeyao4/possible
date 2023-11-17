<script setup lang="ts">

import {CheckOne} from "@icon-park/vue-next";
import {Possible} from "@renderer/model";
import INode = Possible.INode;
import IProject = Possible.IProject;

defineProps<{
  list: INode[],
  projectMap: Map<string, IProject>
}>()

</script>

<template>
  <div v-for="task in list" :key="task.id" class="item completed-item">
    <check-one theme="filled" size="20" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="icon-park"
               @click="task.state='normal'"/>
    <del class="text-wrap">
      <div>{{ task.name }}</div>
      <div class="project-name">{{ projectMap.get(task.projectId)?.name }}</div>
    </del>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  padding-left: 8px;
  text-align: center;
  background-color: var(--color-side-active);
  width: 100%;
  height: 56px;
  margin: 4px 0 4px 0;
  border-radius: 4px;
}

.text-wrap{
  text-align: start;
}

.icon-park {
  margin: 0 8px 0 4px;
  color: #b2b4b4;
  display: flex;
  height: 40px;
  width: 30px;
  padding-top: 2px;
  justify-content: center;
  align-items: start;
}

.project-name {
  color: rgb(0, 0, 0, 0.3);
}

.completed-item {
  color: #b2b4b4;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
}
</style>
