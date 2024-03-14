<script setup lang="ts">
import { Down, Right } from '@icon-park/vue-next'

const model = defineModel()

</script>

<template>
  <div>
    <div class="main" @click="model=!model">
      <down
        v-if="model"
        theme="outline"
        size="24"
        fill="#333"
        :stroke-width="2"
        style="display: flex; justify-content: center; align-items: center"
      />
      <right
        v-else
        theme="outline"
        size="24"
        fill="#333"
        :stroke-width="2"
        style="display: flex; justify-content: center; align-items: center"
      />
      已完成 0
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  height: 32px;
  width: max-content;
  margin: 8px 0 8px 0;
  text-align: center;
  padding: 0 8px;
  user-select: none;
}
</style>