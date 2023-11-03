<script setup>
import IconSvg from "@renderer/component/IconSvg.vue";

const props = defineProps(['show'])

function handleClose() {
  window.api.windowClose()
}

function handleMaximize() {
  window.api.windowMaximize()
}

function handleMinimize() {
  window.api.windowMinimize()
}
</script>

<template>
  <div>
    <div class="main">
      <div v-if="props.show??true" class="container">
        <div class="window-icon window-minimize" @click="handleMinimize">
          <icon-svg iconname="icon-window-minimize1"/>
        </div>
        <div class="window-icon window-maximize" @click="handleMaximize">
          <icon-svg iconname="icon-window-maximize" style="font-size: 16px"/>
        </div>
        <div class="window-icon window-close" @click="handleClose">
          <icon-svg iconname="icon-window-close"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  height: 24px;
  -webkit-app-region: drag;
  flex-direction: row-reverse;

  .container {
    -webkit-app-region: no-drag;
    display: flex;
    justify-content: center;
    align-items: center;

    .window-icon {
      display: inline-block;
      padding: 6px 8px 6px 8px;
      font-size: 8px;
      color: black;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>
