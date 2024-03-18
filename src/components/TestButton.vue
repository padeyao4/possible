<script setup lang="ts">
import OperationTip from '@/components/OperationTip.vue'
import { useStore } from '@/stores/store'
import { Experiment } from '@icon-park/vue-next'
import type { CustomGraph } from '@/g6/core/graph'
import { inject, type ShallowRef } from 'vue'

const graphRef = inject<ShallowRef<CustomGraph>>('graph')
const store = useStore()

function onClick() {
  const { nodesMap, edgesMap } = store.currentProject
  console.log("-----------------------------------------------")
  console.log([...nodesMap.values()].map(n => n.data.name))
  console.log([...edgesMap.values()].map(n => {
    return nodesMap.get(n.source).data.name + "->" + nodesMap.get(n.target).data.name
  }))
  console.log("--------------------")
  console.log('graph node:', graphRef.value.getAllNodesData().map(n => n.data.name))
  console.log('graph edge:', graphRef.value.getAllEdgesData().map(n => nodesMap.get(n.source).data.name + "->" + nodesMap.get(n.target).data.name))
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