<script setup lang="ts">
import { computed, ref } from 'vue';
import ECounterButton from '@/components/common/ECounterButton.vue';
import BacklogItem from '@/components/backlog/BacklogItem.vue';
import { Plus } from '@element-plus/icons-vue';
import EDraggable from '@/components/common/EDraggable.vue';
import { useBacklog, useSettings } from '@/stores';
import { Backlog } from '@/core';
import BacklogEditor from '@/components/backlog/BacklogEditor.vue';

const backlogs = useBacklog();

const onUpdate = (current: Backlog, other: Backlog) => {
  [current.orderIndex, other.orderIndex] = [other.orderIndex, current.orderIndex];
};

const showComplete = ref(false);
const showRight = ref(false);
const settings = useSettings();

const inputEl = ref<HTMLInputElement>();

const addNew = () => {
  const value = inputEl.value.value.trim();
  if (!value) return;
  backlogs.add(value);
  inputEl.value.value = '';
};

const width = computed(() => {
  return showRight.value ? `calc( 100vw - ${settings.sideWidth}px - 300px )` : '100%';
});

const editorVisible = ref(true);
</script>

<template>
  <div class="flex h-screen w-full flex-row">
    <div class="flex h-screen w-full flex-col p-3">
      <div class="drag-region flex h-10 w-full shrink-0 items-end text-xl text-gray-600">
        备忘录
      </div>
      <el-scrollbar class="w-full">
        <e-draggable :update="() => {}" :list="backlogs.todos" class="w-full" handle="data-move">
          <template #default="{ item }">
            <backlog-item :item="item" />
          </template>
        </e-draggable>
        <e-counter-button :count="backlogs.completes.length" />
        <e-draggable :update="() => {}" :list="backlogs.completes">
          <template #default="{ item }">
            <backlog-item :item="item" />
          </template>
        </e-draggable>
      </el-scrollbar>
      <div class="flex h-12 shrink-0 flex-row items-center rounded-md border border-gray-200">
        <div class="flex h-10 w-10 items-center justify-center">
          <el-icon size="26"><Plus /></el-icon>
        </div>
        <input @keydown.enter="addNew" ref="inputEl" class="h-full w-full bg-amber-100 p-1" />
      </div>
    </div>
    <backlog-editor v-model="editorVisible" class="shrink-0" />
  </div>
</template>

<style scoped>
.left {
  display: flex;
  flex-direction: column;
  width: v-bind(width);
  height: 100vh;
}

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
  flex-direction: row;
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
<!--  <div class="backlog">
    <div class="left">
      <div class="title">备忘录</div>
      <el-scrollbar :always="false" wrap-style="overflow-x: hidden;">
        <div class="content">
          <div class="todos">
            <e-draggable
              :list="backlog.todos"
              class="wrapper"
              handle="data-move"
              :update="onUpdate"
            >
              <template #default="{ item }">
                <backlog-item :item="item" />
              </template>
            </e-draggable>
          </div>
          <e-counter-button
            :count="backlog.completesCount"
            v-model="showComplete"
            class="count-class"
          />
          <div class="completed" v-show="showComplete">
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
    <backlog-editor v-model="showRight" style="flex-shrink: 0" />
  </div>-->
