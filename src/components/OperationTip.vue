<script setup lang="ts">
defineProps<{ content: string }>()
</script>

<template>
  <el-tooltip
    :content="content"
    placement="top"
    :show-after="200"
    :offset="10"
    popper-class="tip-class"
    :enterable="false"
  >
    <slot />
  </el-tooltip>
</template>

<style scoped>
.tip-class {
  border: 0 !important;
  opacity: 0.7;
}
</style>