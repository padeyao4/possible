<script setup lang="ts">
import {Close, Minus, Square} from '@icon-park/vue-next'
import {dumps} from "@renderer/util/data";

// const props = defineProps(['close', 'maximize', 'minimize'])
const props = defineProps<{
  visible?: boolean
  onBeforeClose?: () => void
}>()

function winMin() {
  window.api.windowMainMinimize()
}

function winMax() {
  window.api.windowMainMaximize()
}

function winClose() {
  props.onBeforeClose?.()
  window.api.windowMainClose(dumps())
}
</script>

<template>
  <div>
    <div class="settings-button">
      <div class="container">
        <div v-show="visible" class="window-icon window-minimize" @click="winMin">
          <minus theme="outline" size="14" fill="#333" :strokeWidth="2"/>
        </div>
        <div v-show="visible" class="window-icon window-maximize" @click="winMax">
          <square theme="outline" size="14" fill="#333" :strokeWidth="2" strokeLinejoin="miter" strokeLinecap="square"/>
        </div>
        <div v-show="visible" class="window-icon window-close" @click="winClose">
          <close theme="filled" size="14" fill="#333" :strokeWidth="2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-button {
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
      background: rgba(33, 37, 118, 0.1);
    }

    .window-minimize:hover {
      background: rgba(33, 37, 118, 0.1);
    }

    .window-close:hover {
      background: rgba(255, 0, 0, 0.5);
      border-radius: 0 8px 0 0;
    }
  }
}
</style>
