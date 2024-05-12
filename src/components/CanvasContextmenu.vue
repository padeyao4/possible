<script setup lang="ts">

</script>

<template>
  <div id="canvas-type-menu">
    <div>新建</div>
  </div>
</template>

<style scoped>
#canvas-type-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  padding: 8px;
  color: white;

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 32px;

    &:hover {
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>