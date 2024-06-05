<script setup lang="ts">
import PosButton from '@/components/common/PosButton.vue'
</script>
<template>
  <div class="avatar-container">
    <div class="acount-info">
      <div class="username">username</div>
      <div class="email">email</div>
    </div>
    <div class="account-button-group">
      <pos-button background="info">账单</pos-button>
      <pos-button background="error" :style="{ color: '#fff' }">退出</pos-button>
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 120px;
  padding: 8px;
  overflow: hidden;
}
.acount-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: start;
  justify-content: center;
}

.account-button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.username {
  font-size: 30px;
}
.email {
  font-size: 18px;
}
</style>
