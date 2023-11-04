<script setup>
import {Close,Square,Minus} from '@icon-park/vue-next'
import {useProjectStore} from "@renderer/store/project";
import {computed} from "vue";

const props = defineProps(['show'])
const projectStore = useProjectStore()

function handleClose() {
  window.api.windowClose(JSON.stringify(projectStore.projects))
}

function handleMaximize() {
  window.api.windowMaximize()
}

function handleMinimize() {
  window.api.windowMinimize()
}

const windowIsMaximized = computed(() => {
  console.debug('title bar windows maximized status')
  return window.api.windowIsMaximized()
})
</script>

<template>
  <div>
    <div class="main">
      <div v-if="props.show??true" class="container">
        <div class="window-icon window-minimize" @click="handleMinimize">
          <minus theme="outline" size="14" fill="#333" :strokeWidth="2" strokeLinecap="miter"/>
        </div>
        <div class="window-icon window-maximize" @click="handleMaximize">
          <square theme="outline" size="14" fill="#333" :strokeWidth="2" strokeLinejoin="miter" strokeLinecap="square"/>
        </div>
        <div class="window-icon window-close" @click="handleClose">
          <close theme="filled" size="14" fill="#333" :strokeWidth="2" strokeLinecap="miter"/>
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
