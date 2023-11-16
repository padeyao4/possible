<script setup lang="ts">

import {UpdateRotation} from '@icon-park/vue-next'
import log from 'electron-log'

async function checkUpdate() {
  const result = await window.api.checkForUpdates()
  log.info(result)
}

</script>

<template>
  <update-rotation @click="checkUpdate" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
</template>

<style scoped>

</style>
