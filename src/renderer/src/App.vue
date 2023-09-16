<template>
  <Main></Main>
</template>

<script setup lang="ts">
import data from '@renderer/assets/data.json'
import Main from '@renderer/components/Main.vue'
import { registerBehaviors } from '@renderer/g6'
import { useGlobalStore } from '@renderer/store/global'

useGlobalStore().$patch(data)
registerBehaviors()
</script>
