<script setup lang="ts">
import OperationTip from '@/components/OperationTip.vue'
import { Experiment } from '@icon-park/vue-next'
import type { CustomGraph } from '@/g6/core/graph'
import { inject, type ShallowRef } from 'vue'
import { debug } from '@/utils/debug-utils'

const graphRef = inject<ShallowRef<CustomGraph>>('graph')

function onClick() {
  debug(graphRef.value)
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