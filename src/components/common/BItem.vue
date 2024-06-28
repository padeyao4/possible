<script setup lang="ts">
defineProps<{
  item: any;
}>();
</script>

<template>
  <div class="item">{{ item.name }}</div>
</template>

<style scoped>
.item {
  width: 100%;
  height: 40px;
  background-color: #e1e2e3;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
