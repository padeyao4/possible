<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useCounter } from '@/stores/counter';
import { useBacklog } from '@/stores';
import CountLabel from '@/components/common/CountLabel.vue';

const counter = useCounter();
const backlog = useBacklog();
</script>

<template>
  <div class="side-header">
    <div
      class="side-list-item"
      :data-active="$route.name === 'today'"
      data-hover
      @click="$router.push({ name: 'today' })"
    >
      <Icon icon="solar:sun-2-broken" class="side-icon" />
      <div class="side-item-text my-day">我的一天</div>
      <count-label :count="counter.count" />
    </div>
    <div
      class="side-list-item"
      :data-active="$route.name === 'backlog'"
      data-hover
      @click="$router.push({ name: 'backlog' })"
    >
      <Icon icon="solar:pallete-2-broken" class="side-icon" />
      <div class="side-item-text">备忘录</div>
      <count-label :count="backlog.todosCount" style="margin-left: auto" />
    </div>
    <div
      class="side-list-item"
      :data-active="$route.name === 'manage'"
      data-hover
      @click="$router.push({ name: 'manage' })"
    >
      <Icon icon="solar:checklist-minimalistic-broken" class="side-icon" />
      <div class="side-item-text">任务管理</div>
    </div>
  </div>
</template>

<style scoped>
.side-header {
  margin-top: 12px;
  box-shadow:
    rgba(27, 31, 35, 0.06) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;

  & > * {
    display: flex;
    align-items: center;
    height: 40px;
    margin: 4px;
    padding: 4px;
    user-select: none;
  }

  .my-icons {
    & > *:first-child {
      width: 20px;
      height: 20px;
    }
  }

  .my-day {
    flex-grow: 1;
    width: 100%;
  }

  .count-label {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 4px;
    color: #000000;
    font-weight: 600;
    font-size: 12px;
    background-color: #00000015;
    border-radius: 50%;
  }

  .side-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
}
</style>
