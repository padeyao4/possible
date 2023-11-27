<script setup lang="ts">
import {ListAdd, Plus} from "@icon-park/vue-next";
</script>

<template>
  <div class="create-task-input">
    <div class="footer-input">
      <plus theme="outline" size="24" fill="#333" :strokeWidth="2" class="icon"/>
      <input class="input"/>
      <list-add theme="outline" size="24" fill="#333" :strokeWidth="2" class="icon"/>
    </div>
  </div>
</template>

<style scoped>
.create-task-input {
  height: 100%;
  padding: 8px 24px 8px 24px;

  .footer-input {
    display: flex;
    align-items: center;
    height: 100%;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.7);

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px;
    }

    .input {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      border: 0;
      outline-style: none;
      background: rgba(255, 255, 255, 0.7);
    }

    & * > {
      display: flex;
      align-items: center;
    }
  }
}
</style>
