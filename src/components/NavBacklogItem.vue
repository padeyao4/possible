<script setup lang="ts">
import NavItem from './NavItem.vue';
import { usePlanStore } from '@/stores';

const planStore = usePlanStore();
</script>

<template>
  <nav-item icon="icon-[fluent--task-list-ltr-20-filled]" text="备忘录" route-name="backlog"
    :count="planStore.todoBacklogs.length" />
</template>

<style scoped></style>
