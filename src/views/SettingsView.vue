<script setup lang="ts">
import AccountInfo from '@/components/SettingsViewComponent/AccountInfo.vue';
import AboutComponent from '@/components/SettingsViewComponent/AboutComponent.vue';
import { Back } from '@element-plus/icons-vue';
</script>
<template>
  <div class="flex flex-col items-center">
    <header class="flex h-16 w-screen items-center justify-start border-b border-gray-300">
      <div
        class="m-4 flex h-10 w-10 items-center justify-center hover:bg-blue-50"
        @click="$router.back()"
      >
        <el-icon class="h-10 w-10" :size="30"><Back /></el-icon>
      </div>
      <div class="text-xl text-gray-500">设置</div>
    </header>
    <div class="" style="width: 550px">
      <AccountInfo />
      <AboutComponent />
    </div>
  </div>
</template>
