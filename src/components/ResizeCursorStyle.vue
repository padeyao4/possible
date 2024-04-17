<script setup lang="ts">
import { useSettings } from '@/stores/settings'

const settings = useSettings()
const showTitlebar = import.meta.env?.VITE_TITLEBAR === 'true'
</script>

<template>
  <div v-if="showTitlebar&&!settings.isMaximize" class="mouse-style">
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
.mouse-style {
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
}
</style>