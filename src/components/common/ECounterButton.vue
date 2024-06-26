<script setup lang="ts">
import { ArrowDownBold, ArrowRightBold } from '@element-plus/icons-vue';

defineProps<{
  count: number;
}>();

const visible = defineModel();
</script>

<template>
  <div class="counter-button" @click="visible = !visible">
    <el-icon class="icon">
      <ArrowDownBold v-if="visible" />
      <ArrowRightBold v-else />
    </el-icon>
    已完成 {{ count }}
  </div>
</template>

<style scoped>
.counter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: 32px;
  padding: 0 8px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  user-select: none;
}
.icon {
  margin-right: 4px;
}
</style>
