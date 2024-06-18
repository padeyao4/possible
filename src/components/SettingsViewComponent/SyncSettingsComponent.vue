<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue';
import ECheckbox from '@/components/common/ECheckbox.vue';
import { useAccount } from '@/stores/account';
import { KEYS, useNotify } from '@/stores/notity';
import { computed } from 'vue';

const account = useAccount();
const notify = useNotify();

const checked = computed({
  get: () => {
    return account.online && account.enableSync;
  },
  set: (value) => {
    if (account.online) {
      account.enableSync = value;
    }
  }
});

const notifyShow = computed(() => {
  return (
    checked.value &&
    (notify.getNotify(KEYS.GET_DATA_FAILED) || notify.getNotify(KEYS.PUT_DATA_FAILED))
  );
});
</script>
<template>
  <SettingsItem>
    <template #title>远程存储</template>
    <template #description>
      <p>启用服务端存储,将本地数据备份到服务器。需要登录账号</p>
      <p v-show="notifyShow" class="error">同步数据失败,请检查网络配置</p>
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
