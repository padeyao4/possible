<script setup lang="ts">

import {Info, Plus, SaveOne, Upload} from "@icon-park/vue-next";
import SettingButton from "@renderer/views/LayoutView/SettingButton.vue";
import {ref} from "vue";
import {useProjectStore} from "@renderer/store/project";

const props = defineProps(['onAddClick'])
const projectStore = useProjectStore()
const front = ref(true)

/**
 * 导出所有项目数据
 */
function save() {
  window.api.exportProject(JSON.stringify(projectStore.projects))
}

/**
 * 根据文件格式导入数据
 */
async function load() {
  const projects = await window.api.importProject()
  if (projects === 'cancel') {
    return
  }
  projectStore.merge(projects)
}
</script>

<template>
  <div>
    <div class="main">
      <div v-if="front" class="front">
        <div class="add-button" @click="()=>{props.onAddClick?.()}">
          <plus theme="filled" size="24" fill="#333" :strokeWidth="2"
                style="display: flex;justify-content: center; align-items: center"/>
          <div style="padding: 0 0 2px 4px">新建项目</div>
        </div>
        <setting-button @click="front=false"/>
      </div>
      <div v-else class="backend" @mouseleave="front=true">
        <upload theme="outline" size="20" fill="#333" :strokeWidth="2" @click="load"/>
        <save-one theme="outline" size="20" fill="#333" :strokeWidth="2" @click="save"/>
        <info theme="outline" size="20" fill="#333" :strokeWidth="2"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  height: 100%;


  .add-button {
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    width: 200px;
    height: 100%;
  }

  .front {
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .backend {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    > * {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      margin: 4px;
      padding: 4px;
      border-radius: 4px;

      &:hover {
        background: rgba(37, 159, 167, 0.1);
        border-radius: 4px;
      }
    }
  }
}
</style>
