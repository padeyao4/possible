<script setup lang="ts">
import { usePlanStore } from '@/stores';
import NavItem from './NavItem.vue';

const planStore = usePlanStore()
</script>

<template>
  <nav-item icon="icon-[solar--sun-broken]" text="我的一天" :count="planStore.todoPlans.length" route-name="today" />
</template>

<style scoped></style>
