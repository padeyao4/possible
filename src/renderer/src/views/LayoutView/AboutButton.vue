<script setup lang="ts">

import {Info, Github, FishOne} from "@icon-park/vue-next";
import {onBeforeUnmount, ref} from "vue";

const visible = ref(false)

onBeforeUnmount(() => {
  console.log('unmount', visible.value)
})

const githubSize = ref(24)

function openGithub() {
  window.open('https://github.com/padeyao4/possible')
}

</script>

<template>
  <div>
    <Teleport to="body">
      <el-dialog v-model="visible" :align-center="true" title="关于"
                 :width="300"
                 :style="{'border-radius':'8px','overflow':'hide'}"
                 modal-class="modal-class"
      >
        <el-space direction="vertical" style="width: 100%;height: 100%">
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
            喜欢就点一个小星星吧
            <github theme="filled" :size="githubSize" fill="#bd10e0"
                    class="github"
                    @click="openGithub"
                    @mouseenter="githubSize=26"
                    @mouseleave="githubSize=24"/>
          </div>
          <div>
            欢迎闲聊和摸
            <fish-one theme="filled" size="20" fill="#f8e71c" style="margin: 4px"/>
          </div>
          <div style="margin-top: 16px;">版本号: 0.0.xx</div>
        </el-space>
      </el-dialog>
    </Teleport>
    <info theme="outline" size="20" fill="#333" :strokeWidth="2" @click="visible=true" class="info"/>
  </div>
</template>

<style scoped>
.info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.github {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}
</style>
