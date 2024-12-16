<script setup lang="ts">
import NavItem from './NavItem.vue';
import { useDataStore } from '@/stores';

const dataStore = useDataStore();
</script>

<template>
  <nav-item icon="icon-[solar--sun-broken]" text="我的一天" :count="dataStore.todoNodes.length" route-name="today" />
</template>

<style scoped></style>
