<script setup lang="ts">
import LoginModel from './LoginModel.vue'
import RegisterButton from './RegisterButton.vue'
</script>

<template>
  <div class="account-info">
    <div class="right">
      <p class="info-h">你的账户</p>
      <p class="info-text">
        你没有登录。使用Possible同步服务,分享信息及获取会员服务都需要你登录账号
      </p>
    </div>
    <div class="left">
      <LoginModel />
      <RegisterButton />
    </div>
  </div>
</template>

<style scoped>
.account-info {
  display: flex;
  flex-direction: row;
  padding: 4px 0;
  border: 1px solid #00000030;

  .right {
    flex-grow: 1;
    width: 100%;
    margin: 4px 0;

    .info-h {
      font-size: 15px;
    }
    .info-text {
      font-size: 13px;
    }
  }
  .left {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    & > * {
      margin: 0 4px;
    }
    & > *:first-child {
      margin: 0 4px 0 0;
    }
    & > *:last-child {
      margin: 0 0 0 4px;
    }
  }
}

p {
  color: #00000090;
}
</style>
