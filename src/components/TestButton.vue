<script setup lang="ts">
import OperationTip from '@/components/OperationTip.vue'
import { useStore } from '@/stores/store'
import { Experiment } from '@icon-park/vue-next'

// const graphRef = inject<Ref<CustomGraph>>('graph')
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