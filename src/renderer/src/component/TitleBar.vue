<script setup lang="ts">
import { Close, Minus, Square } from '@icon-park/vue-next'
import { dumps } from '@renderer/util/data'
import { useStore } from '@renderer/store'

const props = defineProps<{
  visible?: boolean
  onBeforeClose?: () => void
}>()

const store = useStore()

function winMin() {
  window.api.windowMainMinimize()
}

function winMax() {
  window.api.windowMainMaximize()
}

function winClose() {
  props.onBeforeClose?.()
  window.api.saveData(dumps())
  window.api.windowMainClose()
}
</script>

<template>
  <div>
    <div class="title-bar">
      <div class="title-bar-container">
        <div v-if="store.dev && visible" class="window-icon icon-dev">
          <el-text class="mx-1" type="success">Dev</el-text>
        </div>
        <div v-show="visible" class="window-icon window-minimize" @click="winMin">
          <minus theme="outline" size="14" fill="#333" :stroke-width="2" />
        </div>
        <div v-show="visible" class="window-icon window-maximize" @click="winMax">
          <square
            theme="outline"
            size="14"
            fill="#333"
            :stroke-width="2"
            stroke-linejoin="miter"
            stroke-linecap="square"
          />
        </div>
        <div v-show="visible" class="window-icon window-close" @click="winClose">
          <close theme="filled" size="14" fill="#333" :stroke-width="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-bar {
  display: flex;
  height: 24px;
  -webkit-app-region: drag;
  flex-direction: row-reverse;

  .title-bar-container {
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

    .icon-dev {
      background: antiquewhite;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: start;
      user-select: none;
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
