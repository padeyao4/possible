<script setup lang="ts">
import {Config} from "@icon-park/vue-next";
</script>

<template>
  <div>
    <div class="settings-button">
      <config theme="outline" size="24" fill="#333" :strokeWidth="2"
              style="display: flex;justify-content: center;align-items: center; width: 30px;height: 30px"/>
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
    border-radius: 8px;
  }
}
</style>
