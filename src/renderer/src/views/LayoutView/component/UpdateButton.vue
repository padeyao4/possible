<script setup lang="ts">

import {UpdateRotation} from '@icon-park/vue-next'
import log from 'electron-log'
import {ref} from "vue";

const turn = ref(false)
const timeoutRef = ref()

async function checkUpdate() {
  turn.value = true
  clearTimeout(timeoutRef.value)
  timeoutRef.value = setTimeout(() => {
    turn.value = false
  }, 2_000)
  const result = await window.api.checkForUpdates()
  log.info(result)
}

</script>

<template>
  <div class="update-rotation">
    <update-rotation class="icon" :class="{'turn':turn}" @click="checkUpdate" theme="outline" size="20" fill="#333"
                     :strokeWidth="2"/>
  </div>
</template>

<style scoped>

.update-rotation {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.turn {
  animation: turn 2s linear infinite;
}

@keyframes turn {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(720deg);
  }
}

</style>
