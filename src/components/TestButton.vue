<script setup lang="ts">
import OperationTip from '@/components/OperationTip.vue'
import { useStore } from '@/stores/store';
import { Experiment } from '@icon-park/vue-next'

const store = useStore()

function onClick() {
  store.dailyUpdate()
}
</script>

<template>
  <div>
    <operation-tip content="测试按钮">
      <experiment theme="outline" size="20" fill="#333" :stroke-width="2"
        style="display: flex;justify-content: center;align-items: center;width: 24px;height: 24px" @click="onClick" />
    </operation-tip>
  </div>
</template>