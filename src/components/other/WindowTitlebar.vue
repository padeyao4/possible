<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Icon } from '@iconify/vue'
import { useEventListener } from '@vueuse/core'

function onMaximize() {
  appWindow.toggleMaximize().then((r) => console.log(r))
}

function onClose() {
  appWindow.hide()
}

const showTitlebar = import.meta.env?.VITE_TITLEBAR === 'true'

if (showTitlebar) {
  useEventListener(window, 'resize', () => {
    appWindow.isMaximized().then((r) => {
      const el1 = document.getElementById('titlebar')
      el1.toggleAttribute('data-operation-cancel', r)
      const el2 = document.getElementById('mouse-style')
      el2.toggleAttribute('data-hide', r)
    })
  })
}
</script>

<template>
  <div v-if="showTitlebar" id="titlebar">
    <div class="drag-area" data-tauri-drag-region></div>
    <div class="titlebar-button system-icon-other" @click="appWindow.minimize()">
      <icon icon="clarity:window-min-line" width="20" height="20" class="system-icon" />
    </div>
    <div class="titlebar-button system-icon-other" id="titlebar-maximize" @click="onMaximize">
      <icon icon="clarity:window-max-line" width="20" height="20" class="system-icon" />
    </div>
    <div class="titlebar-button system-icon-close" @click="onClose">
      <icon icon="clarity:window-close-line" width="20" height="20" class="system-icon" />
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
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: flex-end;
  height: 24px;
  margin: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0);
  border-radius: 8px 8px 0 0;
  user-select: none;

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
  align-items: center;
  justify-content: center;
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
    top: 0;
    left: 5px;
    width: calc(100vw - 10px);
    height: 5px;

    &:hover {
      cursor: n-resize;
    }
  }

  .bottom {
    position: fixed;
    bottom: 0;
    left: 5px;
    width: calc(100vw - 10px);
    height: 5px;

    &:hover {
      cursor: n-resize;
    }
  }

  .left {
    position: fixed;
    top: 5px;
    left: 0;
    width: 5px;
    height: calc(100vh - 10px);

    &:hover {
      cursor: w-resize;
    }
  }

  .right {
    position: fixed;
    top: 5px;
    right: 0;
    width: 5px;
    height: calc(100vh - 10px);

    &:hover {
      cursor: w-resize;
    }
  }

  .top-left {
    position: fixed;
    top: 0;
    left: 0;
    width: 5px;
    height: 5px;

    &:hover {
      cursor: nw-resize;
    }
  }

  .top-right {
    position: fixed;
    top: 0;
    right: 0;
    width: 5px;
    height: 5px;

    &:hover {
      cursor: sw-resize;
    }
  }

  .bottom-right {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 5px;
    height: 5px;

    &:hover {
      cursor: nw-resize;
    }
  }

  .bottom-left {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 5px;
    height: 5px;

    &:hover {
      cursor: sw-resize;
    }
  }

  &[data-hide] {
    display: none;
  }
}
</style>
