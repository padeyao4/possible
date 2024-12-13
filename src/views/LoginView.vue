<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAccountStore } from '@/stores'
import router from '@/router'
const route = useRoute()
const accountStore = useAccountStore()

watchEffect(()=>{
  if(route.query.token){
    accountStore.setToken(route.query.token as string)
    setTimeout(()=>{
      router.push({name:'today'})
    })
  }
})

const apiUrl = import.meta.env.VITE_API_URL

</script>

<template>
  <div class="flex h-screen w-screen flex-row">
    <div class="drag-region h-screen w-1/2 bg-blue-400"></div>
    <div class="drag-region flex h-screen w-1/2 items-center justify-center bg-white">
      <div class="no-drag-region h-fit w-60">
        <a :href="`${apiUrl}/oauth2/authorization/github`">github login</a>
      </div>
    </div>
  </div>
</template>
