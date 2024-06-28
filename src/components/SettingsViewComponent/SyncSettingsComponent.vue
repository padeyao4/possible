<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue';
import ECheckbox from '@/components/common/ECheckbox.vue';
import { useAccount } from '@/stores/account';
import { KEYS, useNotify } from '@/stores/notity';
import { computed } from 'vue';
import emitter, { BusEvents } from '@/utils/emitter';

const account = useAccount();
const notify = useNotify();

const checked = computed({
  get: () => {
    return account.enable;
  },
  set: (value) => {
    if (account.online) {
      account.sync = value;
      if (value) {
        emitter.emit(BusEvents['project:fetch']);
      }
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
      <el-switch v-model="checked" size="large" inline-prompt active-text="开" inactive-text="关" />
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
