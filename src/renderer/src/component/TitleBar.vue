<script setup>
import {Close, Square, Minus} from '@icon-park/vue-next'

const props = defineProps(['close', 'maximize', 'minimize'])
</script>

<template>
  <div>
    <div class="settings-button">
      <div class="container">
        <div v-show="props.minimize" class="window-icon window-minimize" @click="()=>props.minimize?.()">
          <minus theme="outline" size="14" fill="#333" :strokeWidth="2" strokeLinecap="miter"/>
        </div>
        <div v-show="props.maximize" class="window-icon window-maximize" @click="()=>props.maximize?.()">
          <square theme="outline" size="14" fill="#333" :strokeWidth="2" strokeLinejoin="miter" strokeLinecap="square"/>
        </div>
        <div v-show="props.close" class="window-icon window-close" @click="()=>props.close?.()">
          <close theme="filled" size="14" fill="#333" :strokeWidth="2" strokeLinecap="miter"/>
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
      background: rgba(33, 37, 118,0.1);
    }

    .window-minimize:hover {
      background: rgba(33, 37, 118,0.1);
    }

    .window-close:hover {
      background: rgba(255, 0, 0, 0.5);
      border-radius: 0 8px 0 0;
    }
  }
}
</style>
