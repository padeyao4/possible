<script setup lang="ts">
import NavItem from './NavItem.vue';
import { useBacklogStore } from '@/stores';

const meno = useBacklogStore();
</script>

<template>
  <nav-item
    icon="icon-[fluent--task-list-ltr-20-filled]"
    text="备忘录"
    route-name="backlog"
    :count="meno.todoBacklogs.length"
  />
</template>

<style scoped></style>
