<script setup lang="ts">
defineProps<{
  loading?: boolean
}>()
</script>
<template>
  <div class="e-button"><slot>button</slot>{{ loading ? '...' : '' }}</div>
</template>
<style scoped>
.e-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  color: #00000090;
  border: 1px solid #00000050;
  border-radius: 4px;
}
.e-button:hover {
  background-color: #00000007;
  cursor: pointer;
}
</style>
