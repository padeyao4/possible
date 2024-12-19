<script setup lang="ts">
import { watchEffect, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAccountStore } from '@/stores'
import router from '@/router'
import GithubCorner from '@/components/other/GithubCorner.vue'
import TermsDialog from '@/components/TermsDialog.vue'

const route = useRoute()
const accountStore = useAccountStore()
const termsDialogRef = ref()

watchEffect(() => {
  if (route.query.token || accountStore.token) {
    const token = route.query.token || accountStore.token;
    accountStore.setToken(token as string)
    accountStore.fetchUser();
    setTimeout(() => {
      router.push({ name: 'today' })
    })
  }
});

const apiUrl = import.meta.env.VITE_API_URL

// 修改背景色计算逻辑
const backgroundClass = computed(() => {
  const hour = new Date().getHours()

  // 清晨 (5-8点): 柔和的蓝紫色渐变
  if (hour >= 5 && hour < 8) {
    return 'from-blue-300/90 to-purple-300/90'
  }
  // 上午 (8-12点): 温暖的蓝色渐变
  if (hour >= 8 && hour < 12) {
    return 'from-blue-400/90 to-cyan-300/90'
  }
  // 下午 (12-17点): 清新的青色渐变
  if (hour >= 12 && hour < 17) {
    return 'from-cyan-400/90 to-teal-300/90'
  }
  // 傍晚 (17-20点): 温��的紫色渐变
  if (hour >= 17 && hour < 20) {
    return 'from-purple-400/90 to-pink-300/90'
  }
  // 晚上 (20-5点): 深邃的靛蓝渐变
  return 'from-indigo-500/90 to-blue-400/90'
})

const showTerms = () => {
  termsDialogRef.value?.showDialog()
}
</script>

<template>
  <div :class="`min-h-screen bg-gradient-to-br ${backgroundClass} bg-gray-50`">
    <GithubCorner />
    <div class="flex min-h-screen items-center justify-center">
      <div class="w-full max-w-md px-4">
        <div class="flex justify-center">
          <div class="w-full max-w-md rounded-2xl bg-white/95 p-10 shadow-xl backdrop-blur-sm">
            <div class="mb-10 space-y-3 text-center">
              <h2 class="text-3xl font-bold text-gray-800">欢迎回来</h2>
              <p class="text-base text-gray-600">登录以继续你的目标之旅</p>
            </div>

            <a :href="`${apiUrl}/oauth2/authorization/github`" class="login-button group">
              <span class="icon-[mdi--github] h-6 w-6 transition-transform group-hover:scale-110"></span>
              <span class="text-lg">使用 GitHub 账号登录</span>
            </a>

            <div class="mt-8 text-center">
              <p class="text-sm text-gray-500">
                登录即表示您同意我们的
                <button @click="showTerms" class="text-blue-600 transition-colors hover:text-blue-800 hover:underline">
                  服务条款和隐私政策
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TermsDialog ref="termsDialogRef" />
  </div>
</template>

<style scoped>
.login-button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  background-color: #111827;
  padding: 1rem 1.5rem;
  color: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transition: all 0.2s;
}

.login-button:hover {
  background-color: #1f2937;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.login-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #111827;
}
</style>
