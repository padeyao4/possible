<script setup lang="ts">
import {useGlobalStore} from "@/store/global";
import {computed, ref} from "vue";

const store = useGlobalStore()

const projectName = computed({
  get: () => {
    return store.currentProject.name
  },
  set: (v) => {
    store.currentProject.name = v
  }
})

let iconOpacity = ref<number>(0)
let editShow = ref<boolean>(true)

const handleInput = () => {
  iconOpacity.value = 0.5
  editShow.value = true
}
</script>

<template>
  <div>
    <div class="pro-label">
      <div v-if="editShow" class="p-detail" @mouseenter="iconOpacity=0.5"
           @mouseleave="iconOpacity=0">
        <p class="p-name">{{ projectName }}</p>
        <el-icon :style="{opacity: iconOpacity}" class="icon" @click="editShow=false">
          <Edit/>
        </el-icon>
      </div>
      <el-input v-else v-model="projectName" @blur="handleInput" style="border: 0"
             @keydown.enter="handleInput"/>
    </div>
  </div>
</template>


<style scoped>
.pro-label {
  display: flex;
  justify-items: center;
  height: 40px;
  width: 120px;
  margin: 0 10px 0 10px;

  .p-detail {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .p-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
  }

  .icon {
    margin: 0 0 0 2px;
  }
}
</style>