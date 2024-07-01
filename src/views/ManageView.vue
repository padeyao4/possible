<script setup lang="ts">
import BDraggable from '@/components/common/EDraggable.vue';
import { ref } from 'vue';
import type { DraggableType } from '@/components/types';

const list = ref<DraggableType[]>([
  { name: 'item1', id: '1' },
  { name: 'item1', id: '2' },
  { name: 'item1', id: '3' },
  { name: 'item1', id: '4' },
  { name: 'item1', id: '5' },
  { name: 'item1', id: '6' },
  { name: 'item1', id: '7' },
  { name: 'item1', id: '8' },
  { name: 'item1', id: '9' }
]);

const onSetValue = () => {
  window.ipcRenderer.send('set-value', {
    key: 'hello',
    value: 'world'
  });
};

const onGetValue = async () => {
  const ans = await window.ipcRenderer.invoke('get-value', {
    key: 'hello'
  });
  console.log(ans);
};

const onGetStoreFilePath = async () => {
  const path = await window.ipcRenderer.invoke('get-store-path');
  console.log(path);
};
</script>
<template>
  <div class="manage-view">
    <div class="title">title</div>
    <b-draggable
      :list="list"
      :update="
        (current, other) => {
          const index = list.findIndex((item) => item.id === current.id);
          const otherIndex = list.findIndex((item) => item.id === other.id);
          list.splice(index, 1);
          list.splice(otherIndex, 0, current);
        }
      "
    >
      <template #default="{ item }">
        <div class="item">{{ item.id }}</div>
      </template>
    </b-draggable>
    <el-button @click="onSetValue">set</el-button>
    <el-button @click="onGetValue">get</el-button>
    <el-button @click="onGetStoreFilePath">show path</el-button>
  </div>
</template>

<style scoped>
.manage-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #5c83ab;
}
.title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 58px;
  padding: 0 24px;
  background-color: #5c83ab;
}
.item {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 4px;
  padding: 0 8px;
  background-color: #e1e2e3;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
