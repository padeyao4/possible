<script setup lang="ts">

import { inject } from 'vue'
import OperationTip from '@/components/OperationTip.vue'
import { Local } from '@icon-park/vue-next'

const graph = inject('graph') as any

function handle() {
  setTimeout(() => {
    const { x, y } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
    graph.value.translate({ dx: x, dy: y })
  })
}
</script>

<template>
  <div>
    <operation-tip content="恢复坐标">
      <Local
        theme="outline"
        size="20"
        fill="#333"
        :stroke-width="2"
        style="display: flex;justify-content: center;align-items: center;width: 24px;height: 24px"
        @click="handle"
      />
    </operation-tip>
  </div>
</template>