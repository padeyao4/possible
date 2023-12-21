<script setup lang="ts">
import LayoutView from '@renderer/views/LayoutView/index.vue'
import {RouterView, useRoute} from "vue-router";
import {onMounted} from "vue";
import router from "@renderer/router";

const route = useRoute()

onMounted(() => {
  router.push({
    name: 'today'
  })
})

</script>

<template>
  <layout-view>
    <router-view :key="route.fullPath"/>
  </layout-view>
</template>
