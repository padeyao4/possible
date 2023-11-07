<script setup>
import TitleBar from "@renderer/component/TitleBar.vue";

function close() {
  window.api.windowSettingsClose()
}

function minimize() {
  window.api.windowSettingsMinimize()
}
</script>

<template>
  <div>
    <div class="settings-button">
      <title-bar :close="close" :minimize="minimize"/>
      <div>
        <el-text>
          email: guojian_k@qq.com<br/>
          github: https://github.com/padeyao4/possible
        </el-text>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-button {
  background: var(--color-background);
  width: var(--win-width);
  height: var(--win-height);
  border-radius: 8px;
  box-shadow: rgba(9, 30, 66, 0.3) 0 1px 1px, rgba(9, 30, 66, 0.25) 0 0 1px 1px;
}
</style>
