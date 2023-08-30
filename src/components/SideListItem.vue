<script lang="ts" setup>
import {useGlobalStore} from "@/store/global";
import router from "@/router";

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
  <div>
    <button v-for="item in store.projects"
            @click="()=>handleClick(item.id)"
            :class="{active:item.id===store.active,it:true}"
            :key="item.id">
      {{ item.name }}
    </button>
  </div>
</template>

<style scoped>
.it {
  width: 100%;
  height: 40px;
}

.active {
  background-color: burlywood;
}
</style>