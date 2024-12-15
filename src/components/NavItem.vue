<script setup lang="ts">
defineProps<{
  icon: string;      // 图标类名
  text: string;      // 导航文本
  count?: number;    // 可选的计数
  routeName: string; // 路由名称
}>();
</script>

<template>
  <div 
    @click="$router.push({ name: routeName })" 
    :class="[
      'mx-2.5 my-1 flex h-12 flex-row items-center rounded-md hover:bg-blue-50',
      { 'bg-blue-50': $route.name === routeName }
    ]"
  >
    <span :class="[icon, 'mx-2 bg-gray-600 text-2xl']" />
    <el-text class="grow">{{ text }}</el-text>
    <div v-if="count" class="mx-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
      <el-text  size="small">{{ count ?? 0 }}</el-text>
    </div>
  </div>
</template>

<style scoped></style> 