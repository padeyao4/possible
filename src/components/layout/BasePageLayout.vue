<script setup lang="ts">
import { useLayoutStore } from '@/stores';
import MenuToggleButton from '@/components/common/MenuToggleButton.vue';

defineProps<{
    title: string;
    backgroundColor?: string;
}>();

const layoutStore = useLayoutStore();
</script>

<template>
    <div class="flex h-screen flex-col" :style="{ backgroundColor: backgroundColor ?? '#82bbb5' }">
        <!-- 页面标题区域 -->
        <div class="drag-region mt-2 mb-5 px-5 drag-region">
            <menu-toggle-button v-if="!layoutStore.menuVisible" class="no-drag-region" />
            <div v-else class="flex h-6 w-6 items-center justify-center rounded-md no-drag-region"></div>
            <div class="flex w-full shrink-0 items-end  text-xl text-gray-600 h-15">
                {{ title }}
            </div>
            <slot name="subtitle" />
        </div>

        <!-- 主要内容区域 -->
        <el-scrollbar class="grow px-5" always>
            <slot />
        </el-scrollbar>

        <!-- 底部区域 -->
        <slot name="footer" />
    </div>
</template>

<!-- style="height: 52px" -->