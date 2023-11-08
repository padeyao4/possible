<script setup lang="ts">
const props = defineProps<{
  content: string
}>()
</script>

<template>
  <el-tooltip :content="props.content"
              placement="top"
              offset="4"
              show-after="200"
              popper-class="tip-class"
              :enterable="false"
  >
    <slot/>
  </el-tooltip>
</template>
