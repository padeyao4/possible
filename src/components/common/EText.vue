<script setup lang="ts"></script>
<template>
  <div class="e-text">
    <slot>nothing</slot>
  </div>
</template>
<style scoped>
.e-text {
  font-size: 13px;
}

.e-text[data-info] {
  color: #00000080;
}

</style>
