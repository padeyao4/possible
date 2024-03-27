<script setup lang="ts">

import OperationTip from '@/components/OperationTip.vue'
import { Local } from '@icon-park/vue-next'
import { useStore } from '@/stores/store'
import { OFFSET_X, OFFSET_Y } from '@/configs/constant'
import { useRoute } from 'vue-router'
import { dateToX } from '@/utils/time'

const store = useStore()
const route = useRoute()
const currentProject = store.projects[route.params.id as string]

function handle() {
  setTimeout(() => {
    const { x, y } = currentProject.data.graph.getCanvasByViewport({ x: 0, y: 0 })
    const currentX = dateToX(store.currentTime, currentProject.createTime)
    currentProject.data.graph.translate({ dx: x - currentX + OFFSET_X, dy: y + OFFSET_Y })
  })
}
</script>

<template>
  <div>
    <operation-tip content="恢复坐标">
      <Local theme="outline" size="20" fill="#333" :stroke-width="2"
             style="display: flex;justify-content: center;align-items: center;width: 24px;height: 24px"
             @click="handle" />
    </operation-tip>
  </div>
</template>