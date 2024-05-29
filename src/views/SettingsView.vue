<script setup>
import { useRoute } from '@/stores/route'
import { ref, watch } from 'vue'
import { invoke } from '@tauri-apps/api'
import { useDebounceFn } from '@vueuse/core'
import { sendNotiflyMessage } from '@/tauri-util'

const route = useRoute()

const config = ref({ base_path: '', remote_enable: false, git_auth_method: 'Password' })

invoke('read_config').then((response) => {
  Object.assign(config.value, response)
})

const writeConfig = useDebounceFn(async () => {
  await invoke('write_config', { config: config.value })
}, 1000)

watch(config.value, writeConfig)

const cloneRepositoryLoading = ref(false)

function cloneRepository() {
  cloneRepositoryLoading.value = true
  invoke('clone_repository').then((response) => {
    cloneRepositoryLoading.value = false
    sendNotiflyMessage({
      title: '下载数据',
      body: response ? '数据下载成功' : '下载数据失败'
    })
  })
}
</script>
<template>
  <div class="settings">
    <header>
      <my-icon icon="solar:arrow-left-linear" class="back-button" @click="route.back()" /> 设置
    </header>
    <main>
      <div class="container">
        <div class="item">
          <div>数据本地存储地址</div>
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
              <input
                v-model="config.git_url"
                placeholder="例如: https://github.com/username/repo.git"
              />
              <div>认证方式</div>
              <select v-model="config.git_auth_method">
                <option value="Password">密码认证 - Username & Password</option>
                <option value="Key">密钥认证 - Private Key</option>
              </select>
              <template v-if="config.git_auth_method === 'Password'">
                <input v-model="config.git_username" placeholder="用户名" />
                <input v-model="config.git_password" placeholder="密码" type="password" />
              </template>
              <input v-else v-model="config.git_ssh_key" placeholder="私钥地址" />
              <button @click="cloneRepository" :disabled="cloneRepositoryLoading">
                {{ cloneRepositoryLoading ? '下载中...' : '下载仓库' }}
              </button>
            </template>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-bottom-color);

  header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    margin-top: 12px;
    font-size: 24px;
    border-bottom: var(--border-default-style);

    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin: 8px;
      padding: 4px;

      &:hover {
        background-color: var(--background-top-color);
      }
    }
  }

  main {
    display: flex;
    justify-content: center;
    width: 100%;
    height: calc(100vh - 64px);
    overflow-y: auto;

    .container {
      display: flex;
      flex-direction: column;
      width: 550px;
      height: 100%;

      & > *:first-child {
        margin-top: 12px;
      }

      .item {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-right: 0;
        margin-bottom: 12px;
        margin-left: 0;
        padding: 0 0 24px 0;
        border-bottom: var(--border-default-style);

        & > * {
          margin: 4px 0;
          padding: 4px 0;
        }

        input {
          padding: 8px;
          background-color: var(--background-middle-color);
          border: var(--border-default-style);
          border-radius: 4px;
          outline-style: none;
        }

        select {
          padding: 5px;
          background-color: var(--background-middle-color);
          border: var(--border-default-style);
          border-radius: 4px;

          & option {
            padding: 5px;
            background-color: var(--background-middle-color);
            border: var(--border-default-style);

            &:hover {
              background-color: var(--background-top-color);
            }
          }
          &:focus {
            outline: none;
          }
        }

        .description {
          padding: 8px;
          background-color: var(--background-middle-color);
          border: var(--border-default-style);
          border-radius: 4px;
          user-select: text;
        }

        button {
          width: fit-content;
          padding: 8px 12px;
          background-color: var(--primary-color);
          border: var(--border-default-style);
          border-radius: 3px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          /* 较深的边框 */
          cursor: pointer;

          &:hover {
            background-color: var(--primary-color-dark);
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
}
</style>
