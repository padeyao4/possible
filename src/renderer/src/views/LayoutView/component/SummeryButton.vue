<script setup lang="ts">

import {SunOne, Moon} from "@icon-park/vue-next";
import {computed} from "vue";
import {Theme} from "@icon-park/vue-next/es/runtime";
import router from "@renderer/router";
import {useRoute} from "vue-router";
import {useDateStore} from "@renderer/store/date";

const route = useRoute()
const dateStore = useDateStore()

const style = computed<{ theme: Theme, color: string }>(() => {
  return {
    theme: route.params.id ? 'outline' : 'filled',
    color: route.params.id ? '#333' : '#f2b439'
  }
})

function handleClick() {
  router.push({
    name: 'today',
    replace: true
  })
}

</script>

<template>
  <div>
    <div class="main">
      <div class="content" @click="handleClick">
        <moon v-if="dateStore.night" :theme="style.theme" size="20" :fill="style.color" :strokeWidth="2" class="icon"/>
        <sun-one v-else :theme="style.theme" size="20" :fill="style.color" :strokeWidth="2" class="icon"/>
        <div style="display: inline-block; margin:0 8px 0 4px" :style="{color: style.color}">
          我的一天
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.main {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: drag;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    height: 40px;
    width: max-content;
    -webkit-app-region: no-drag;
  }
}

.icon {
  margin: 0 4px 0 8px;
  display: flex;
  justify-content: center;
  align-items: center
}
</style>
