<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue'
import ECheckbox from '@/components/common/ECheckbox.vue'
import { useAccount } from '@/stores/account'
import { computed } from 'vue'

const account = useAccount()

const checked = computed({
  get: () => {
    return account.online && account.enableSync
  },
  set: (value) => {
    if (account.online) {
      account.enableSync = value
    }
  }
})
</script>
<template>
  <SettingsItem>
    <template #title>远程存储</template>
    <template #description>启用服务端存储,将本地数据备份到服务器。需要登录账号</template>
    <template #option>
      <e-checkbox v-model="checked" :disabled="!account.online" />
    </template>
  </SettingsItem>
</template>
<style scoped></style>
