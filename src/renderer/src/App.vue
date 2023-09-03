<template>
  <Main></Main>
</template>

<script setup lang="ts">
import data from '@renderer/assets/data.json'
import Main from '@renderer/components/Main.vue'
import { registerBehaviors } from './g6'
import { useGlobalStore } from './store/global'

useGlobalStore().$patch(data)
registerBehaviors()

</script>
