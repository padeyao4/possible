<script setup lang="ts">
import { usePlanStore, type Plan } from '@/stores';
import { emitter } from '@/utils';
import { Check } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';

const { plan } = defineProps<{
  plan: Plan;
}>();

const planStore = usePlanStore();

const project = computed(() => planStore.getPlan(plan.parentId!));

const showIcon = ref(false);

const emit = defineEmits<{
  'update-status': [status: boolean]
}>();

const handleChange = () => emit('update-status', !plan.isDone);

const handleItemClick = () => {
  emitter.emit('open-editor', {
    id: plan.id!
  });
};
</script>

<template>
  <div class="flex h-14 w-full flex-row items-center rounded-lg border-white bg-white hover:bg-blue-50"
    @pointerover="showIcon = true" @pointerleave="showIcon = false">
    <div
      class="mx-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-500 hover:cursor-pointer"
      @click="handleChange">
      <el-icon v-show="plan.isDone" size="16">
        <Check />
      </el-icon>
    </div>
    <div class="flex h-full grow flex-col justify-center overflow-hidden" @click="handleItemClick">
      <div class="block truncate align-bottom text-base text-gray-500">
        <del v-if="plan.isDone">{{ plan.name }}</del>
        <template v-else>
          {{ plan.name }}
        </template>
      </div>
      <div class="block h-fit items-start truncate text-xs text-gray-500">
        <span class="hover:cursor-pointer">
          {{ project!.name }}
        </span>
      </div>
    </div>
    <div v-show="showIcon"
      class="icon-[icon-park-outline--drag] ml-auto mr-2 block w-10 shrink-0 border border-black bg-gray-500 text-xl"
      :data-draggable-move="plan.id" />
  </div>
</template>
