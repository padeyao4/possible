<script setup lang="ts">

import {Logout, Plus, SaveOne, Upload} from "@icon-park/vue-next";
import SettingButton from "@renderer/views/LayoutView/component/SettingButton.vue";
import {ref} from "vue";
import AboutButton from "@renderer/views/LayoutView/component/AboutButton.vue";
import Tip from "@renderer/component/Tip.vue";
import {dumps, loads} from "@renderer/util/data";
import UpdateButton from "@renderer/views/LayoutView/component/UpdateButton.vue";

const props = defineProps(['onAddClick'])
const front = ref(true)

/**
 * 导出所有项目数据
 */
function save() {
  window.api.exportData(dumps())
}

/**
 * 根据文件格式导入数据
 */
async function load() {
  loads(await window.api.importData())
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
        <tip content="设置">
          <setting-button @click="front=false"/>
        </tip>
      </div>
      <div v-else class="backend">
        <div class="icon-group">
          <tip content="导入">
            <upload theme="outline" size="20" fill="#333" :strokeWidth="2" @click="load"/>
          </tip>
          <tip content="保存">
            <save-one theme="outline" size="20" fill="#333" :strokeWidth="2" @click="save"/>
          </tip>
          <tip content="检查更新">
            <update-button/>
          </tip>
          <tip content="关于">
            <about-button/>
          </tip>
        </div>
        <tip content="返回">
          <logout theme="outline" size="20" fill="#333" :strokeWidth="2" @click="front=true" class="exit-icon"/>
        </tip>
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
