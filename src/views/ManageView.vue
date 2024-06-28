<script setup lang="ts">
import BDraggable from '@/components/common/BDraggable.vue';
import { ref } from 'vue';
import BItem from '@/components/common/BItem.vue';

const list = ref([
  { name: 'item1', id: 1 },
  { name: 'item1', id: 2 },
  { name: 'item1', id: 3 },
  { name: 'item1', id: 4 },
  { name: 'item1', id: 5 },
  { name: 'item1', id: 6 },
  { name: 'item1', id: 7 },
  { name: 'item1', id: 8 },
  { name: 'item1', id: 9 }
]);
</script>
<template>
  <div class="manage-view">
    <div class="title">title</div>
    <b-draggable v-model="list">
      <template #default="{ setRefs }">
        <b-item v-for="item in list" :key="item.id" :item="item" :ref="(e) => setRefs(e)" />
      </template>
    </b-draggable>
  </div>
</template>

<style scoped>
.manage-view {
  width: 100%;
  height: 100%;
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
</style>
