<script setup lang="ts">
</script>
<template>
  <div
    class="ml-1 flex h-full w-10 items-center justify-center rounded-md border border-gray-200 hover:bg-blue-50"
    @click="$router.push({ name: 'settings' })"
  >
    <span class="icon-[cil--settings] bg-gray-500 text-2xl"></span>
  </div>
</template>