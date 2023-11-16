<script setup lang="ts">

import {FishOne, Github, Info} from "@icon-park/vue-next";
import {ref, watchEffect} from "vue";

const visible = ref(false)

const githubSize = ref(24)

const packageObj = ref()

watchEffect(() => {
  window.api.possibleVersion().then(value => {
    packageObj.value = JSON.parse(value)
  })
})


function openGithub() {
  window.open(packageObj.value['homepage'])
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
          <div class="one-line-text">
            喜欢就点一个小星星吧
            <github theme="filled" :size="githubSize" fill="#bd10e0"
                    class="github"
                    @click="openGithub"
                    @mouseenter="githubSize=26"
                    @mouseleave="githubSize=24"/>
          </div>
          <div class="one-line-text">
            <div>欢迎闲聊和摸</div>
            <div style="display: flex;flex-direction: row-reverse; justify-items: center;align-items: center">
              <div class="fish-box">
                <fish-one theme="filled" size="24" fill="#f8e71c" class="fish"/>
              </div>
              <div class="air-box">
                <fish-one theme="filled" size="24" fill="#f8e71c" class="air"/>
              </div>
            </div>
          </div>
          <div style="margin-top: 16px;">版本: {{ packageObj['version'] }}</div>
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

.one-line-text {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center
}

.github {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.fish {
  display: flex;
  align-items: center;
  justify-items: center;
}

.fish-box {
  display: flex;
  justify-items: center;
  align-items: center;

  &:hover + .air-box > .air {
    visibility: visible;
  }

  &:hover .fish {
    visibility: hidden;
  }
}

.air-box {
  display: flex;
  justify-items: center;
  align-items: center;
  margin-left: 4px;

  &:hover + .fish-box > .fish {
    visibility: visible;
  }

  &:hover .air {
    visibility: hidden;
  }
}

.air {
  visibility: hidden;
  display: flex;
  align-items: center;
}

</style>
