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

.drag-area {
  width: 100%;
  height: 100%;
  margin: 5px 0 0 5px;
}

</style>