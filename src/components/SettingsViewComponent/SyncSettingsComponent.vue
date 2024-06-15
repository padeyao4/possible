<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue'
import ECheckbox from '@/components/common/ECheckbox.vue'
import { ref, watch } from 'vue'

const check = ref(true)

watch(check, () => {
  console.log(check.value)
})
</script>
<template>
  <SettingsItem>
    <template #title>远程存储</template>
    <template #description>启用服务端存储,将本地数据备份到服务器。需要登录账号</template>
    <template #option>
      <!-- todo 设置check -->
      <e-checkbox :checked="true" />
    </template>
  </SettingsItem>
</template>
<style scoped></style>
