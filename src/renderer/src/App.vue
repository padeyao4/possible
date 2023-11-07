<script setup lang="ts">
import LayoutView from '@renderer/views/LayoutView/index.vue'
import {useRoute, RouterView, useRouter} from "vue-router";
import {onMounted} from "vue";

const route = useRoute()
const router = useRouter()
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
