<script setup lang="ts"></script>

<template>
  <div class="welcome-card">
    <div class="card">
      <div>可能终于有一天刚好遇见爱情</div>
      <div>可能永远在路上有人奋斗前行</div>
      <div>可能一切的可能相信才有可能</div>
      <div>可能拥有过梦想才能叫做青春</div>
    </div>
  </div>
</template>

<style scoped>
.welcome-card {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: start;
  padding: 30px;

  .card {
    visibility: hidden;
    padding: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row-reverse;
    user-select: none;
    box-shadow: rgba(0, 0, 0, 0.1) 0 10px 50px;

    & > * {
      writing-mode: vertical-rl;
      text-orientation: upright;
      letter-spacing: 2px;
      font-size: 16px;
      font-weight: 1;
      margin: 0 16px;
    }
  }
}
</style>
