<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/stores/store'

const store = useStore()
// const graphRef = inject<Ref<CustomGraph>>('graph')

const visible = computed(() => {
  return store.actionState === 'contextmenu'
})

// const position = computed(() => {
//   const graph = graphRef.value
//   if (!graph) return { x: 0, y: 0 }
//   const position = graph.userData.pointerPosition
//   return graph.getClientByCanvas(position)
// })

/**
 * Deletes a node from the graph based on the node ID stored in the
 * graph's userData.selectItem property.
 * Removes the node data from the graph and closes the context menu.
 */
function handleDelete() {
  // const graph = graphRef.value
  // const { userData } = graph
  // const id = userData.selectItem.id
  // graph.removeData('node', id)
  // todo
  store.removeData('node', store.selectedNode.id)
}

/**
 * Hides the context menu by resetting the graph's userData.status to 'none'.
 */
function onblur() {
  // const graph = graphRef.value
  // const { userData } = graph
  // userData.status = 'none'
  store.actionState = 'none'
}

function onRef(e: any) {
  setTimeout(() => {
    (e as HTMLElement)?.focus()
  })
}

function test() {
  // const currentProject = store.currentProject
  // const graph = graphRef.value
  // console.log(graph.toJson())
  // const j = graph.toJson()
  //
  // graph.read(JSON.parse(j))
  // graph.translateTo({ x: 0, y: 0 })
  // graph.saveData(currentProject.id)
  // const { userData } = graph
  // const nodeId = userData.selectItem.id
  // todo 数据读取错误
  // store.forward(nodeId)
  // graph.changeData({ nodes: currentProject.nodes, edges: currentProject.edges }, 'replace')
  // graph.read({ nodes: currentProject.nodes, edges: currentProject.edges })
}

</script>

<template>
  <teleport to="body">
    <div v-if="visible"
         :style="{ 'position': 'absolute', 'left': store.contextmenuPosition.x + 'px', 'top': store.contextmenuPosition.y + 'px' }"
         @contextmenu.prevent>
      <div class="menu" :ref="onRef" tabindex="0" @blur="onblur">
        <ul @click="onblur">
          <li @click="handleDelete">删除</li>
          <li @click="test">test</li>
        </ul>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.menu {
  width: 80px;
  border-radius: 4px;
  padding: 4px 0;
  overflow: hidden;
  background: #606266;
}

ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  padding: 0 8px;
}

li {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px;
  padding: 4px;
  width: 100%;
  color: white;

  &:hover {
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>