<script setup lang="ts">
const data = ['hello', 'world', 'this is a test']
</script>
<template>
  <div class="my-day">
    <div v-for="value in data" :key="value">
      <div class="item">{{ value }}</div>
    </div>
  </div>
</template>
<style>
.my-day {
  background: var(--color-neptune);
  height: 100%;
  padding: 16px;
  .item {
    display: flex;
    align-items: center;
    padding-left: 8px;
    background-color: #016458;
    width: 100%;
    height: 40px;
    margin: 8px 0 8px 0;
    border-radius: 8px;
  }
}
</style>
