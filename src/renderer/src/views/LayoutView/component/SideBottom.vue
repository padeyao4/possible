<script setup lang="ts">

import {Logout, Upload} from "@icon-park/vue-next";
import SettingButton from "@renderer/views/LayoutView/component/SettingButton.vue";
import {ref} from "vue";
import AboutButton from "@renderer/views/LayoutView/component/AboutButton.vue";
import Tip from "@renderer/component/Tip.vue";
import {loads} from "@renderer/util/data";
import UpdateButton from "@renderer/views/LayoutView/component/UpdateButton.vue";
import AddButton from "@renderer/views/LayoutView/component/AddButton.vue";
import SaveButton from "@renderer/views/LayoutView/component/SaveButton.vue";

const front = ref(true)

/**
 * 根据文件格式导入数据
 */
async function load() {
  await loads()
}
</script>

<template>
  <div class="layout-side-bottom">
    <div v-if="front" class="front">
      <add-button/>
      <tip content="设置">
        <setting-button @click="front=false"/>
      </tip>
    </div>
    <div v-else class="backend">
      <div class="icon-group">
        <tip content="导入">
          <upload theme="outline" size="20" fill="#333" :strokeWidth="2" @click="load"/>
        </tip>
        <save-button/>
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
</template>

<style scoped>
.layout-side-bottom {
  height: 100%;

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
