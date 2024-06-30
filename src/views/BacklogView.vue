<script setup lang="ts">
import { ref } from 'vue';
import ECounterButton from '@/components/common/ECounterButton.vue';
import BacklogItem from '@/components/backlog/BacklogItem.vue';
import { Plus } from '@element-plus/icons-vue';
import EDraggable from '@/components/common/EDraggable.vue';
import { useBacklog } from '@/stores';
import { Backlog } from '@/core';

const backlog = useBacklog();

const onUpdate = (current: Backlog, other: Backlog) => {
  [current.orderIndex, other.orderIndex] = [other.orderIndex, current.orderIndex];
};

const visible = ref(false);

const inputRef = ref<HTMLInputElement>();

const addNew = () => {
  const value = inputRef.value.value;
  backlog.add(value);
  inputRef.value.value = '';
};
</script>

<template>
  <div class="backlog">
    <div class="title">备忘录</div>
    <el-scrollbar :always="false">
      <div class="content">
        <div class="todos">
          <e-draggable :list="backlog.todos" class="wrapper" handle="data-move" :update="onUpdate">
            <template #default="{ item }">
              <backlog-item :item="item" />
            </template>
          </e-draggable>
        </div>
        <e-counter-button :count="backlog.completesCount" v-model="visible" class="count-class" />
        <div class="completed" v-show="visible">
          <backlog-item v-for="item in backlog.completes" :item="item" />
        </div>
      </div>
    </el-scrollbar>
    <div class="footer">
      <div class="input-item">
        <el-icon :size="24" class="input-head-icon">
          <Plus />
        </el-icon>
        <input placeholder="添加备忘录" ref="inputRef" @keydown.enter="addNew" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-item {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  width: 100%;
  height: 48px;
  border: solid 1px #00000030;
  border-radius: 4px;
  .input-head-icon {
    position: absolute;
    width: 48px;
    height: 48px;
    border-right: solid 1px #00000030;
  }
  input {
    width: 100%;
    height: 100%;
    padding-left: 56px;
    border: none;
    border-radius: 4px;
    outline: none;
  }
}
.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  padding: 0 24px;
  overflow-y: auto;
}
.footer {
  display: flex;
  flex-shrink: 0;
  align-items: start;
  height: 100px;
  padding-top: 12px;
  padding-right: 24px;
  padding-left: 24px;
}

.backlog {
  display: flex;
  flex-direction: column;
  height: 100vh !important;
  background-color: #5c83ab90 !important;
}
.title {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  font-size: 18px;
}

.completed {
  & > * {
    margin: 4px 0;
  }
}

.wrapper {
  & > * {
    margin: 4px 0;
  }
}
</style>
