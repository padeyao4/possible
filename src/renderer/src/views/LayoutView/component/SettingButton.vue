<script setup lang="ts">
import {Config} from "@icon-park/vue-next";
</script>

<template>
  <div>
    <div class="settings-button">
      <config theme="outline" size="24" fill="#333" :strokeWidth="2"
              style="display: flex;justify-content: center;align-items: center;height: 100%;width: 100%"/>
    </div>
  </div>
</template>

<style scoped>
.settings-button {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  width: 40px;
  height: 100%;

  :hover {
    background: antiquewhite;
  }
}
</style>
