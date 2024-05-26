<script setup>
import { useRoute } from '@/stores/route'
import { ref, watch } from 'vue'
import { invoke } from '@tauri-apps/api'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()

const config = ref({ base_path: '', remote_enable: false, git_auth_method: 'Password' })

invoke('read_config').then((response) => {
  Object.assign(config.value, response)
})

const writeConfig = useDebounceFn(async () => {
  await invoke('write_config', { config: config.value })
}, 1000)

watch(config.value, writeConfig)
</script>
<template>
  <div class="settings">
    <header>
      <my-icon icon="solar:arrow-left-linear" class="back-button" @click="route.back()" /> 设置
    </header>
    <main>
      <div class="item">
        <div>本地数据存储地址</div>
        <div class="description">{{ config?.base_path ?? '临时数据' }}</div>
      </div>
      <div class="item">
        <div>数据远程存储</div>
        <select v-model="config.remote_enable">
          <option :value="true">开启</option>
          <option :value="false">关闭</option>
        </select>
        <template v-if="config.remote_enable">
          <div>使用git同步</div>
          <select v-model="config.git_enable">
            <option :value="true">开启</option>
            <option :value="false">关闭</option>
          </select>
          <template v-if="config.git_enable">
            <div>git地址</div>
            <input v-model="config.git_url" />
            <div>认证方式</div>
            <select v-model="config.git_auth_method">
              <option value="Password">密码/password</option>
              <option value="Key">密钥/ssh_key</option>
            </select>
            <div>{{ config.git_auth_method }}</div>
            <template v-if="config.git_auth_method === 'Password'">
              <input v-model="config.git_username" placeholder="用户名" />
              <input v-model="config.git_password" placeholder="密码" type="password" />
            </template>
            <input v-else v-model="config.git_ssh_key" placeholder="私钥地址" />
          </template>
        </template>
      </div>
    </main>
  </div>
</template>
<style scoped>
.settings {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #1a1b1c;
  color: #d9d9d9;

  header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    margin-top: 12px;
    font-size: 24px;
    border-bottom: 1px solid #ffffff40;
    .back-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      margin: 8px;
      padding: 4px;
      &:hover {
        background-color: #ffffff20;
      }
    }
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 550px;

    & > *:first-child {
      margin-top: 12px;
    }

    .item {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      margin-left: 0;
      margin-right: 0;
      padding: 8px 0;
      width: 100%;
      border-bottom: 1px solid #ffffff30;
      & > * {
        margin: 4px 0;
        padding: 8px 0;
      }
      input {
        outline-style: none;
        background-color: #2a2a2a;
        color: #d4d4d4;
        border: 1px solid #ffffff30;
        border-radius: 4px;
        padding: 8px;
      }
      select {
        background-color: #1e1e1e;
        color: #d4d4d4;
        border: 1px solid #444;
        padding: 5px;
      }
      select option {
        background-color: #1e1e1e;
        color: #d4d4d4;
        border: 1px solid #444;
        padding: 5px;
      }

      select option:hover {
        background-color: #333;
        color: #fff;
      }

      .description {
        border: 1px solid #ffffff30;
        border-radius: 4px;
        background-color: #2a2a2a;
        color: #d9d9d9;
        user-select: text;
        padding: 8px;
      }
    }
  }
}
</style>
