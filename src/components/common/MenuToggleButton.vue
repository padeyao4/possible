<script setup lang="ts">
import { useLayoutStore } from '@/stores';
import ExpandIcon from '@/components/icon/ExpandIcon.vue';

const layoutStore = useLayoutStore();
</script>

<template>
    <div class="flex h-6 w-6 items-center justify-center rounded-md hover:bg-blue-50/50"
        @click="layoutStore.menuVisible = !layoutStore.menuVisible">
        <expand-icon class="text-gray-400 text-[10px]" />
    </div>
</template>