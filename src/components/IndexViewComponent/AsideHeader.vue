<script setup lang="ts">
import { type Node } from '@/stores/projects'
import { useRoute } from '@/stores/route'
import { computed, inject, type Ref } from 'vue'

const route = useRoute()

const todoList: Ref<Node[]> = inject('todoList')

const todoCount = computed(() => todoList.value.length)
</script>

<template>
  <div class="side-header">
    <div
      class="side-list-item"
      :data-active="route.active.name === 'today'"
      data-hover
      @click="route.linkTo('today')"
    >
      <my-icon icon="solar:sun-2-broken" class="side-icon" />
      <div class="side-item-text my-day">我的一天</div>
      <div class="todo-count">{{ todoCount }}</div>
    </div>
    <div
      class="side-list-item"
      :data-active="route.active.name === 'backlog'"
      data-hover
      @click="route.linkTo('backlog')"
    >
      <my-icon icon="solar:pallete-2-broken" class="side-icon" />
      <div class="side-item-text">备忘录</div>
    </div>
    <div
      class="side-list-item"
      :data-active="route.active.name === 'manage'"
      data-hover
      @click="route.linkTo('manage')"
    >
      <my-icon icon="solar:checklist-minimalistic-broken" class="side-icon" />
      <div class="side-item-text">任务管理</div>
    </div>
  </div>
</template>

<style scoped>
.side-header {
  margin-top: 24px;
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

  .todo-count {
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
    width: 20px;
    height: 20px;
  }
}
</style>
