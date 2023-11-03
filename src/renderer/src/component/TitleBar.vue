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
          <icon-svg iconname="icon-window-min_line"/>
        </div>
        <div class="window-icon window-maximize" @click="handleMaximize">
          <icon-svg iconname="icon-window-max_line" style="font-size: 16px"/>
        </div>
        <div class="window-icon window-close" @click="handleClose">
          <icon-svg iconname="icon-chuangkou-guanbi"/>
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
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 12px;
      color: black;
      width: 44px;
    }

    .window-maximize:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .window-minimize:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .window-close:hover {
      background: rgba(255, 0, 0, 0.5);
    }
  }
}
</style>
