<script setup lang="ts">
import {useGlobalStore} from "@/store/global";
import {computed, ref} from "vue";

const store = useGlobalStore()

const projectName = computed({
  get: () => {
    return store.currentProject.name
  },
  set: () => {
    // todo
  }
})

let editIconVisible = ref<number>(0)

</script>

<template>
  <div>
    <div>
      <div class="pro-label" @mouseenter="editIconVisible=0.5" @mouseleave="editIconVisible=0">
        <p class="p-name">{{ projectName }}</p>
        <el-icon :style="{opacity: editIconVisible}" class="icon">
          <Edit/>
        </el-icon>
      </div>
    </div>
  </div>
</template>


<style scoped>
.pro-label {
  display: flex;
  align-items: center;
  height: 40px;
  width: 120px;
  margin: 0 10px 0 10px;

  .p-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    margin: 0 0 0 2px;
  }
}
</style>