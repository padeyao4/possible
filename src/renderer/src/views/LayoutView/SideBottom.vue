<script setup lang="ts">

import {Plus, SaveOne, Upload, Logout} from "@icon-park/vue-next";
import SettingButton from "@renderer/views/LayoutView/SettingButton.vue";
import {ref} from "vue";
import {useProjectStore} from "@renderer/store/project";
import AboutButton from "@renderer/views/LayoutView/AboutButton.vue";

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
      <div v-else class="backend">
        <div class="icon-group">
          <upload theme="outline" size="20" fill="#333" :strokeWidth="2" @click="load"/>
          <save-one theme="outline" size="20" fill="#333" :strokeWidth="2" @click="save"/>
          <about-button/>
        </div>
        <logout theme="outline" size="20" fill="#333" :strokeWidth="2" @click="front=true" class="exit-icon"/>
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
    box-shadow: rgba(27, 31, 35, 0.06) 1px 0 0,
    rgba(255, 255, 255, 0.25) 1px 0 0 inset;
  }

  .front {
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .backend {
    height: 100%;
    display: grid;
    grid-template-columns: 200px 40px;

    .icon-group {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: rgba(27, 31, 35, 0.06) 1px 0 0,
      rgba(255, 255, 255, 0.25) 1px 0 0 inset;

      > * {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 4px;
        padding: 4px;
        border-radius: 4px;

        &:hover {
          background: rgba(37, 159, 167, 0.1);
        }
      }
    }

    .exit-icon {
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background: rgba(37, 159, 167, 0.1);
      }
    }
  }
}
</style>
