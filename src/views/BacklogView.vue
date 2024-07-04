<script setup lang="ts">
import { computed, ref } from 'vue';
import ECounterButton from '@/components/common/ECounterButton.vue';
import { Plus } from '@element-plus/icons-vue';
import EDraggable from '@/components/common/EDraggable.vue';
import { useBacklog } from '@/stores';
import { Backlog } from '@/core';
import BacklogItem from '@/components/BacklogItem.vue';
import BacklogEditor from '@/components/BacklogEditor.vue';

const backlogs = useBacklog();

const onUpdate = (current: Backlog, other: Backlog) => {
  // todo 设置emitter
  [current.orderIndex, other.orderIndex] = [other.orderIndex, current.orderIndex];
};

const inputEl = ref<HTMLInputElement>();

const addNew = () => {
  const value = inputEl.value.value.trim();
  if (!value) return;
  backlogs.add(value);
  inputEl.value.value = '';
};

const width = computed(() => {
  return editorVisible.value ? 'calc( 100% - 320px )' : '100%';
});

const editorVisible = ref(true);

const counterVisible = ref(false);
</script>

<template>
  <div class="flex h-screen w-full flex-row">
    <div class="flex h-screen flex-col pt-3" :style="{ width }">
      <div class="drag-region mx-3 mb-2 flex h-10 shrink-0 items-end text-xl text-gray-600">
        备忘录
      </div>
      <el-scrollbar class="grow px-3">
        <e-draggable :update="onUpdate" :list="backlogs.todos" handle="data-move">
          <template #default="{ item }">
            <backlog-item :item="item" class="my-1 overflow-x-hidden" />
          </template>
        </e-draggable>
        <e-counter-button :count="backlogs.completes.length" v-model="counterVisible" />
        <e-draggable
          v-if="counterVisible"
          :update="onUpdate"
          :list="backlogs.completes"
          handle="data-move"
        >
          <template #default="{ item }">
            <backlog-item :item="item" class="my-1 overflow-x-hidden" />
          </template>
        </e-draggable>
      </el-scrollbar>
      <div
        class="mx-3 my-4 flex h-12 shrink-0 flex-row items-center overflow-hidden rounded-md border border-gray-200"
      >
        <div class="flex h-full w-14 items-center justify-center border-r border-gray-200">
          <el-icon size="26"><Plus /></el-icon>
        </div>
        <input
          @keydown.enter="addNew"
          ref="inputEl"
          class="h-full w-full p-2 text-base text-gray-600"
          style="
            :focus {
              border: none;
              outline: none;
            }
          "
        />
      </div>
    </div>
    <backlog-editor v-model="editorVisible" class="shrink-0 border-l border-gray-300" />
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
