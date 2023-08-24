<template>
  <Main></Main>
</template>

<script setup lang="ts">
import data from '@/example/data.json'
import Main from "@/components/Main.vue";
import {registerBehaviors, registerLayout} from './g6'
import {useGlobalStore} from "@/store/global";

useGlobalStore().$patch(data)
registerBehaviors()
registerLayout()

</script>