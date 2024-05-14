<script setup lang="ts">
function handleDelete(e: MouseEvent) {
  const el = e.target as Element
  console.log(el)
  const attr = el.getAttribute('data-type')
  if (attr === 'edge') {
    console.log(el.getAttribute('data-key'))
  }
}
</script>

<template>
  <div class="canvas-contextmenu-list">
    <div @click="handleDelete">
      删除边
    </div>
  </div>
</template>

<style scoped>

</style>