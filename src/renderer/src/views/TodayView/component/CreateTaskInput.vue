<script setup lang="ts">
import {ListAdd, Plus, Round} from "@icon-park/vue-next";
</script>

<template>
  <div class="create-task-input">
    <div class="footer-input">
      <div class="addon">
        <list-add theme="outline" size="24" fill="#333" :strokeWidth="2" class="icon"/>
        <div class="text">默认</div>
      </div>
      <input class="input" placeholder="添加任务"/>
      <plus theme="outline" size="24" fill="#333" :strokeWidth="2" class="icon plus"/>
      <Round theme="outline" size="24" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="icon round"/>
    </div>
  </div>
</template>

<style scoped>
.create-task-input {
  height: 100%;
  padding: 8px 24px 16px 24px;

  .footer-input {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    height: 100%;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.7);

    .addon {
      display: flex;
      .text{
        font-weight: 1;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 4px;
        width: max-content;
      }
    }

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px;
    }

    .plus {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px;
    }

    .round {
      display: none;
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
      padding: 0 8px;
      background: rgba(255, 255, 255, 0.7);
    }

    .input:focus ~ .plus {
      display: none;
    }

    .input:focus ~ .round {
      display: flex;
    }
  }
}
</style>
