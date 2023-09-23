<template>
  <Main></Main>
</template>

<script setup lang="ts">
import Main from '@renderer/components/Main.vue'
import { registerBehaviors } from '@renderer/g6'
import { useGlobalStore } from '@renderer/store/global'
useGlobalStore().$hydrate()
registerBehaviors()
</script>
