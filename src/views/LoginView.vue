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

watchEffect(()=>{
  if(route.query.token){
    accountStore.setToken(route.query.token as string)
    setTimeout(()=>{
      router.push({name:'today'})
    })
  }
})

const apiUrl = import.meta.env.VITE_API_URL

// 根据时间计算背景色
const backgroundClass = computed(() => {
  const hour = new Date().getHours()
  
  // 清晨 (5-8点): 温暖的橙色到粉色
  if (hour >= 5 && hour < 8) {
    return 'from-orange-300 to-pink-300'
  }
  // 上午 (8-12点): 明亮的橙色到黄色
  if (hour >= 8 && hour < 12) {
    return 'from-orange-400 to-yellow-200'
  }
  // 下午 (12-17点): 温暖的橙色到红色
  if (hour >= 12 && hour < 17) {
    return 'from-orange-500 to-red-300'
  }
  // 傍晚 (17-20点): 柔和的粉色到紫色
  if (hour >= 17 && hour < 20) {
    return 'from-pink-400 to-purple-300'
  }
  // 晚上 (20-5点): 深色调的紫色到蓝色
  return 'from-purple-500 to-indigo-400'
})

const showTerms = () => {
  termsDialogRef.value?.showDialog()
}
</script>

<template>
  <div :class="`min-h-screen bg-gradient-to-br ${backgroundClass}`">
    <GithubCorner />
    <div class="flex min-h-screen items-center justify-center px-4">
      <div class="w-full max-w-md rounded-lg bg-white/90 backdrop-blur-sm p-8 shadow-2xl">
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-3xl font-bold text-gray-800">Welcome to Possible</h1>
          <p class="text-gray-600">登录以开始使用目标管理工具</p>
        </div>
        
        <a
          :href="`${apiUrl}/oauth2/authorization/github`"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white transition-colors hover:bg-gray-700"
        >
          <span class="icon-[mdi--github] h-6 w-6"></span>
          <span>使用 GitHub 账号登录</span>
        </a>
        
        <div class="mt-6 text-center text-sm text-gray-600">
          <p>
            登录即表示您同意我们的
            <button 
              @click="showTerms"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              服务条款和隐私政策
            </button>
          </p>
        </div>
      </div>
    </div>
    <TermsDialog ref="termsDialogRef" />
  </div>
</template>
