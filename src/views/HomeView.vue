<script setup lang="ts">
import { useStore } from '@/stores/store'

const store = useStore()
</script>

<template>
  <div>
    <main>
      <ol>
        <li>one</li>
        <li>two</li>
        <li>three</li>
        <li>four</li>
        <li>five</li>
      </ol>
    </main>
  </div>
</template>

<style scoped>
ol {
  list-style-type: none;
}
</style>
