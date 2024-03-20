<script setup lang="ts">

import { inject, type ShallowRef } from 'vue'
import OperationTip from '@/components/OperationTip.vue'
import { Local } from '@icon-park/vue-next'
import { useStore } from '@/stores/store';
import type { CustomGraph } from '@/g6/core/graph';
import { OFFSET_X } from '@/configs/constant';

const graph = inject<ShallowRef<CustomGraph>>('graph')
const store = useStore()

function handle() {
  setTimeout(() => {
    const { x, y } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
    const currentX = store.getCurrentX(store.currentProject)
    graph.value.translate({ dx: x - currentX + OFFSET_X, dy: y })
  })
}
</script>

<template>
  <div>
    <operation-tip content="恢复坐标">
      <Local theme="outline" size="20" fill="#333" :stroke-width="2"
        style="display: flex;justify-content: center;align-items: center;width: 24px;height: 24px" @click="handle" />
    </operation-tip>
  </div>
</template>