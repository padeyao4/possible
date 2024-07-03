<script setup lang="ts">
import { useSettings } from '@/stores/settings';
import { storeToRefs } from 'pinia';
import { useSide } from '@/stores';

const settings = useSettings();
const { sideWidth } = storeToRefs(settings);

const side = useSide();
const { width } = storeToRefs(side);
</script>

<template>
  <div class="fixed top-0 z-50 flex w-screen flex-row" style="height: 35px">
    <div class="drag-region" :style="{ height: '15px', width: `${width}px` }"></div>
    <div class="drag-region flex-grow"></div>
    <div class="h-full" style="width: 137px"></div>
  </div>
</template>
