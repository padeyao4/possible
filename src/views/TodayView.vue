<template>
  <div class="my-day">
    <h1 style="color: #c8c9cc">
      My Day
    </h1>
    <div v-for="value in store.dataByDay">
      <div class="item">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useGlobalStore} from "@/store/global";

const store = useGlobalStore()
</script>

<style>
.my-day {
  .item {
    background-color: #016458;
    width: 400px;
    height: 40px;
    border-bottom: 1px solid #181818;
  }
}
</style>