<script setup lang="ts">
import OperationTip from '@/components/OperationTip.vue'
import { useStore } from '@/stores/store'
import { Experiment } from '@icon-park/vue-next'
import type { CustomGraph } from '@/g6/core/graph'
import { inject, type ShallowRef } from 'vue'

const graphRef = inject<ShallowRef<CustomGraph>>('graph')
const store = useStore()

function onClick() {
  // store.graphProject.nodes.push({
  //   id: v4(),
  //   data: {
  //     name: faker.person.fullName(),
  //     x: 60,
  //     y: 300,
  //     detail: '',
  //     record: '',
  //     completed: false,
  //     sortedIndex: -1,
  //     project: {
  //     }
  //   }
  // })
  // const { currentProject } = store
  // const graph = graphRef.value
  // currentProject.nodes = graph.getAllNodesData()
  // currentProject.edges = graph.getAllEdgesData()
  // store.addDays(3)
  // store.dailyUpdate()
  // console.log(store.save())
  // console.log('graph node:',graphRef.value.getAllNodesData())
  // console.log('graph edge:',graphRef.value.getAllEdgesData())
  const p = graphRef.value.getCanvasByViewport({ x: 0, y: 0 })
  console.log(p)
  graphRef.value.translate({ dx: p.x, dy: p.y })
}
</script>

<template>
  <div>
    <operation-tip content="测试按钮">
      <experiment theme="outline" size="20" fill="#333" :stroke-width="2"
                  style="display: flex;justify-content: center;align-items: center;width: 24px;height: 24px"
                  @click="onClick" />
    </operation-tip>
  </div>
</template>