<script setup lang="ts">
import { useGlobalStore } from '../store/global'

const store = useGlobalStore()

const handleTest = () => {
  window.api.projectSave()
}
const handleTestQuery = () => {
  const a = window.api.testQuery()
  console.log('web', a)
}
</script>
<template>
  <div class="my-day">
    <h1 style="{color: #c8c9cc}">My Day</h1>
    <div v-for="value in store.dataByDay" :key="value">
      <div class="ite">{{ value }}</div>
    </div>
    <button @click="handleTest">test</button>
    <button @click="handleTestQuery">test query</button>
  </div>
</template>
<style>
.my-day {
  .ite {
    background-color: #016458;
    width: 400px;
    height: 40px;
    border-bottom: 1px solid #181818;
  }
}
</style>
