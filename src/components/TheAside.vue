<script setup lang="ts">

import AsideHeader from '@/components/AsideHeader.vue'
import AsideBody from '@/components/AsideBody.vue'
import AsideFooter from '@/components/AsideFooter.vue'
</script>

<template>
  <div id="po-aside">
    <aside-header id="aside-header" />
    <aside-body id="aside-body" />
    <aside-footer id="aside-footer" />
  </div>
</template>

<style scoped>
#po-aside {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

#aside-header {
  height: min-content;
}

#aside-body {
  flex-grow: 1;
}

#aside-footer {
  flex-shrink: 0;
}
</style>