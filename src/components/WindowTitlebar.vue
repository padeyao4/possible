<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Icon } from '@iconify/vue'
import { useEventListener } from '@vueuse/core'

function onMaximize() {
  appWindow.toggleMaximize()
}

function onClose() {
  appWindow.hide()
}

const showTitlebar = import.meta.env?.VITE_TITLEBAR === 'true'

if (showTitlebar) {
  useEventListener(window, 'resize', () => {
    appWindow.isMaximized().then(r => {
      const el1 = document.getElementById('titlebar')
      el1.toggleAttribute('data-operation-cancel', r)
      const el2 = document.getElementById('mouse-style')
      el2.toggleAttribute('data-hide', r)
    })
  })
}
</script>

<template>
  <div
    v-if="showTitlebar"
    id="titlebar">
    <div class="drag-area" data-tauri-drag-region></div>
    <div class="titlebar-button system-icon-other" @click="appWindow.minimize()">
      <Icon icon="clarity:window-min-line" width="20" height="20" class="system-icon" />
    </div>
    <div class="titlebar-button system-icon-other" id="titlebar-maximize" @click="onMaximize">
      <Icon icon="clarity:window-max-line" width="20" height="20" class="system-icon" />
    </div>
    <div class="titlebar-button system-icon-close" @click="onClose">
      <Icon icon="clarity:window-close-line" width="20" height="20" class="system-icon" />
    </div>
  </div>
  <div v-if="showTitlebar" id="mouse-style">
    <div class="top"></div>
    <div class="bottom"></div>
    <div class="left"></div>
    <div class="right"></div>
    <div class="top-left"></div>
    <div class="top-right"></div>
    <div class="bottom-left"></div>
    <div class="bottom-right"></div>
  </div>
</template>

<style scoped>
#titlebar {
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
  z-index: 999;

  .drag-area {
    width: 100%;
    height: 100%;
    margin: 5px 0 0 5px;
  }

  &[data-operation-cancel] {
    border-radius: 0;
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

#mouse-style {
  position: fixed;
  z-index: 9999;

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

  .top-left {
    position: fixed;
    height: 5px;
    width: 5px;
    top: 0;
    left: 0;

    &:hover {
      cursor: nw-resize;
    }
  }

  .top-right {
    position: fixed;
    height: 5px;
    width: 5px;
    top: 0;
    right: 0;

    &:hover {
      cursor: sw-resize;
    }
  }

  .bottom-right {
    position: fixed;
    height: 5px;
    width: 5px;
    bottom: 0;
    right: 0;

    &:hover {
      cursor: nw-resize;
    }
  }

  .bottom-left {
    position: fixed;
    height: 5px;
    width: 5px;
    bottom: 0;
    left: 0;

    &:hover {
      cursor: sw-resize;
    }
  }

  &[data-hide] {
    display: none;
  }
}
</style>