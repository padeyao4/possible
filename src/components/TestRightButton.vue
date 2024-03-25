<script setup lang="ts">
import OperationTip from '@/components/OperationTip.vue'
import { useStore } from '@/stores/store';
import { RightC } from '@icon-park/vue-next'

const store = useStore()

function onClick() {
  store.addDays(1)
}
</script>

<template>
  <div>
    <operation-tip content="右移动">
      <right-c theme="outline" size="20" fill="#333" :stroke-width="2"
        style="display: flex;justify-content: center;align-items: center;width: 24px;height: 24px" @click="onClick" />
    </operation-tip>
  </div>
</template>