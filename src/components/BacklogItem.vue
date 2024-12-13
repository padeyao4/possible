<script setup lang="ts">
import { ref } from 'vue';
import { Check } from '@element-plus/icons-vue';
import { emitter } from '@/utils';
import type { Backlog } from '@/stores';
import type { BacklogViewModel } from '@/views/BacklogView.vue';

const { item, backlogViewModel } = defineProps<{
  item: Backlog;
  backlogViewModel: BacklogViewModel;
}>();

const handleIconClick = () => (item.status = !item.status);

const handleClick = () => {
  backlogViewModel.selectId = item.id;
  emitter.emit('open-backlog-editor', item);
};

const showIcon = ref(false);
</script>

<template>
  <div
    :class="['my-1 flex h-14 w-full items-center rounded-lg bg-white hover:bg-blue-50']"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="mx-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-500 hover:cursor-pointer"
      @click="handleIconClick"
    >
      <el-icon v-show="item.status" size="16"><Check /></el-icon>
    </div>
    <div class="flex h-full grow items-center overflow-hidden" @click="handleClick">
      <el-text truncated :tag="item.status ? 'del' : 'span'"> {{ item.name }} </el-text>
    </div>
    <div
      v-show="showIcon"
      class="icon-[icon-park-outline--drag] ml-auto mr-2 block shrink-0 border border-black bg-gray-500 text-xl"
      :data-draggable-move="item.id"
    />
  </div>
</template>
