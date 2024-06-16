<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue'
import ECheckbox from '@/components/common/ECheckbox.vue'
import { useAccount } from '@/stores/account'
import { useNotity } from '@/stores/notity'
import { computed } from 'vue'

const account = useAccount()
const notity = useNotity()

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

const notityShow = computed(() => {
  return checked.value && notity.projectsSyncFailed
})

async function coverLocalData() {
  await account.pullProjects()
}

async function coverRemoteData() {
  await account.sendForceProjects()
}
</script>
<template>
  <SettingsItem>
    <template #title>远程存储</template>
    <template #description>
      <p>启用服务端存储,将本地数据备份到服务器。需要登录账号</p>
      <p v-show="notityShow" class="error">
        本地数据落后于服务端,是否<a @click="coverRemoteData">覆盖服务器端数据</a> 或者
        <a @click="coverLocalData">覆盖本地数据</a>
      </p>
    </template>
    <template #option>
      <e-checkbox v-model="checked" :disabled="!account.online" />
    </template>
  </SettingsItem>
</template>
<style scoped>
p {
  color: #00000080;
  font-size: 13px;
}
.error {
  color: #ff000080;
  font-weight: 800;
}
a {
  margin: 0 8px;
  color: #ff000090;
  font-weight: 800;
  font-size: 13px;
  font-style: italic;
  text-decoration: underline;
  cursor: pointer;
}
</style>
