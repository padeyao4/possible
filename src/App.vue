<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue';
import { useListenDataChange, useListenLogin, useLoadLocalData } from '@/service/client';

useLoadLocalData();
useListenLogin();
useListenDataChange();
</script>

<template>
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
