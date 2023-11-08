<script setup lang="ts">
const props = defineProps<{
  content: string
}>()
</script>

<template>
  <el-tooltip :content="props.content"
              placement="top"
              :show-after="200"
              :offset="4"
              popper-class="tip-class"
              :enterable="false"
  >
    <slot/>
  </el-tooltip>
</template>
