<script lang="ts" setup>
import {Graph} from "@antv/g6";
import {onMounted} from 'vue'

let root = $ref<HTMLElement>()
let graph = $ref<Graph>()

onMounted(() => {
  const data = {
    // 点集
    nodes: [
      {
        id: 'node1',
        x: 100,
        y: 200,
      },
      {
        id: 'node2',
        x: 300,
        y: 200,
      },
    ],
    // 边集
    edges: [
      // 表示一条从 node1 节点连接到 node2 节点的边
      {
        source: 'node1',
        target: 'node2',
      },
    ],
  };
  graph = new Graph({
    container: root!,
  })
  graph.on('canvas:dblclick', () => {
    console.log('canvas:dblclick')
  })
  graph.on('node:dblclick', () => {
    console.log('node:dblclick')
  })
  graph.on('dblclick', () => {
    console.log('dblclick')
  })
  graph.read(data)
})

</script>

<template>
  <div ref="root" style="width: 100% ; height: 800px; background-color: antiquewhite"></div>
</template>