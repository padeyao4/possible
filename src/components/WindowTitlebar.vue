<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useSettings } from '@/stores/settings'
import { Icon } from '@iconify/vue'

const settings = useSettings()

onMounted(() => {
  if (showTitlebar) {
    appWindow.isMaximized().then((r) => {
      settings.isMaximize = r
    })
  }
})

function onMaximize() {
  appWindow.toggleMaximize().then(() => {
    setTimeout(() => {
      appWindow.isMaximized().then((r) => {
        settings.isMaximize = r
      })
    })
  })
}

function onClose() {
  appWindow.hide()
}

const showTitlebar = import.meta.env?.VITE_TITLEBAR === 'true'

</script>

<template>
  <div
    v-if="showTitlebar"
    :class="['titlebar',{'cancel-radius':settings.isMaximize}]">
    <div class="drag-area" data-tauri-drag-region></div>
    <div class="mouse-style">
      <div class="top"></div>
      <div class="bottom"></div>
      <div class="left"></div>
      <div class="right"></div>
      <div class="top-left"></div>
      <div class="top-right"></div>
      <div class="bottom-left"></div>
      <div class="bottom-right"></div>
    </div>
    <div class="titlebar-button system-icon-other" id="titlebar-minimize" @click="appWindow.minimize()">
      <Icon icon="clarity:window-min-line" width="20" height="20" class="system-icon" />
    </div>
    <div class="titlebar-button system-icon-other" id="titlebar-maximize" @click="onMaximize">
      <Icon icon="clarity:window-max-line" width="20" height="20" class="system-icon" />
    </div>
    <div class="titlebar-button system-icon-close" id="titlebar-close" @click="onClose">
      <Icon icon="clarity:window-close-line" width="20" height="20" class="system-icon" />
    </div>
  </div>
</template>

<style scoped>
.titlebar {
  height: 24px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0);
  margin: 0;
  user-select: none;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  .drag-area {
    width: 100%;
    height: 100%;
    margin: 5px 0 0 5px;
  }

  .mouse-style {
    position: fixed;

    .top {
      position: fixed;
      height: 5px;
      width: calc(100vw - 10px);
      top: 0;
      left: 5px;

      &:hover {
        cursor: n-resize;
      }
    }

    .bottom {
      position: fixed;
      height: 5px;
      width: calc(100vw - 10px);
      bottom: 0;
      left: 5px;

      &:hover {
        cursor: n-resize;
      }
    }

    .left {
      position: fixed;
      height: calc(100vh - 10px);
      width: 5px;
      top: 5px;
      left: 0;

      &:hover {
        cursor: w-resize;
      }
    }

    .right {
      position: fixed;
      height: calc(100vh - 10px);
      width: 5px;
      top: 5px;
      right: 0;

      &:hover {
        cursor: w-resize;
      }
    }
    .top-left{
      position: fixed;
      height: 5px;
      width: 5px;
      top: 0;
      left: 0;

      &:hover {
        cursor: nw-resize;
      }
    }
    .top-right{
      position: fixed;
      height: 5px;
      width: 5px;
      top: 0;
      right: 0;

      &:hover {
        cursor: sw-resize;
      }
    }
    .bottom-right{
      position: fixed;
      height: 5px;
      width: 5px;
      bottom: 0;
      right: 0;

      &:hover {
        cursor: nw-resize;
      }
    }
    .bottom-left{
      position: fixed;
      height: 5px;
      width: 5px;
      bottom: 0;
      left: 0;

      &:hover {
        cursor: sw-resize;
      }
    }
  }
}

.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 24px;
}

.system-icon-other:hover {
  background: rgba(0, 0, 0, 0.06);
}

.system-icon {
  color: #6f6f6f;
}

.system-icon-close:hover {
  background: #c73d3d;

  & > * {
    color: #edeef2;
  }
}
</style>