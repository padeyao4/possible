<script setup lang="ts">
import OperationTip from '@/components/OperationTip.vue'
import { useStore } from '@/stores/store'
import { TestTube } from '@icon-park/vue-next'
import { inject, type Ref } from 'vue'
import type { CustomGraph } from '@/g6/core/graph'

const graphRef = inject<Ref<CustomGraph>>('graph')
const store = useStore()

function onClick() {
  const { currentProject } = store
  const graph = graphRef.value
  currentProject.nodes = graph.getAllNodesData()
  currentProject.edges = graph.getAllEdgesData()
  // store.addDays(3)
  // store.dailyUpdate()
  console.log(store.save())
}
</script>

<template>
  <div>
    <operation-tip content="测试按钮">
      <test-tube theme="outline" size="20" fill="#333" :stroke-width="2"
                 style="display: flex;justify-content: center;align-items: center;width: 24px;height: 24px"
                 @click="onClick" />
    </operation-tip>
  </div>
</template>