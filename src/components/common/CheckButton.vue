<script setup lang="ts">
import CheckIcon from '@/components/icon/CheckIcon.vue';
import NotCheckIcon from '@/components/icon/NotCheckIcon.vue';

defineProps<{ checked: boolean }>();
</script>

<template>
  <div class="check-button">
    <check-icon class="icon" v-if="checked" />
    <not-check-icon class="icon" v-else />
  </div>
</template>

<style scoped>
.check-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
