<template>
  <div class="my-day">
    <h1>
      My Day
    </h1>
    <div v-for="value in store.dataByDay()">
      <div class="item">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
</script>

<style>
.my-day {
  .item {
    background-color: #016458;
    width: 400px;
    height: 40px;
    border-bottom: 1px solid #181818;
    color: #181818;
  }
}
</style>