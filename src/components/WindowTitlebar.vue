<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useSettings } from '@/stores/settings'

const settings = useSettings()

onMounted(() => {
  if(showTitlebar){
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

const showTitlebar = import.meta.env?.VITE_TITLEBAR === 'true'

</script>

<template>
  <div
    v-if="showTitlebar"
    data-tauri-drag-region
    :class="['titlebar',{'cancel-radius':settings.isMaximize}]">
    <div class="titlebar-button" id="titlebar-minimize" @click="appWindow.minimize()">
      <img
        src="https://api.iconify.design/mdi:window-minimize.svg"
        alt="minimize"
      />
    </div>
    <div class="titlebar-button" id="titlebar-maximize" @click="onMaximize">
      <img
        src="https://api.iconify.design/mdi:window-maximize.svg"
        alt="maximize"
      />
    </div>
    <div class="titlebar-button" id="titlebar-close" @click="appWindow.close()">
      <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
    </div>
  </div>
</template>

<style scoped>
.titlebar {
  height: 24px;
  border-radius: 0 8px 0 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0);
  user-select: none;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.cancel-radius {
  border-radius: 0;
}

.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 24px;
}

.titlebar-button:hover {
  background: rgba(0,0,0,0.1);
}
</style>