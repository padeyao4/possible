<script setup lang="ts">
import {useGlobalStore} from "../store/global";
import {computed, nextTick, ref} from "vue";

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

const inputRef = ref()

const submitInput = () => {
  iconOpacity.value = 0
  editShow.value = true
}

const handleInputClick = () => {
  editShow.value = false
  iconOpacity.value = 0
  nextTick(() => {
    inputRef.value.focus()
  })
}

</script>

<template>
  <div>
    <div class="pro-label">
      <div v-if="editShow" class="p-detail" @mouseenter="iconOpacity=0.5"
           @mouseleave="iconOpacity=0">
        <p class="p-name">{{ projectName }}</p>
        <el-icon :style="{opacity: iconOpacity}" class="icon" @click="handleInputClick">
          <Edit/>
        </el-icon>
      </div>
      <el-input ref="inputRef" v-else v-model="projectName" @blur="submitInput" style="border: 0"
                @keydown.enter="submitInput"/>
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
