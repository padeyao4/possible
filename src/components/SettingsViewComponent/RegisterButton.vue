<script setup lang="ts">
function handleRegister() {
  console.log('hello')
}
</script>
<template>
  <div @click="handleRegister" class="register-button">注册</div>
</template>
<style scoped>
.register-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  color: #00000090;
  border: 1px solid #00000050;
  border-radius: 4px;
}
</style>
