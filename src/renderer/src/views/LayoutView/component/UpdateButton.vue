<script setup lang="ts">

import {UpdateRotation} from '@icon-park/vue-next'

function checkUpdate() {
  window.api.checkForUpdates()
}

</script>

<template>
  <update-rotation @click="checkUpdate" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
</template>

<style scoped>

</style>
