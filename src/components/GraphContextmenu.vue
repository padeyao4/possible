<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/stores/store'

const store = useStore()

const visible = computed(() => {
  return store.actionState === 'contextmenu'
})

/**
 * Deletes a node from the graph based on the node ID stored in the
 * graph's userData.selectItem property.
 * Removes the node data from the graph and closes the context menu.
 */
function handleDelete() {
  store.removeNode(store.selectedNode.id)
}

/**
 * Hides the context menu by resetting the graph's userData.status to 'none'.
 */
function onblur() {
  store.actionState = 'none'
}

function onRef(e: any) {
  setTimeout(() => {
    (e as HTMLElement)?.focus()
  })
}

function moveRight() {
  store.moveRight(store.selectedNode.id, store.currentProject)
}

function moveLeft() {
  store.moveLeft(store.selectedNode.id, store.currentProject, store.getCurrentX(store.currentProject))
}

function showNeighbors() {
  const neighbors = store.getNeighbors(store.selectedNode.id, store.currentProject)
  console.log('neighbors', neighbors);
}

function searchOutEdges() {
  const allNodeIds = []
  store.bfsOutEdge(store.selectedNode.id, store.currentProject, (node) => allNodeIds.push(node))
  console.log('outEdges', allNodeIds.map(id => store.currentProject.nodesMap.get(id).data.name));
}

function searchInEdges() {
  const allNodeIds = []
  store.bfsInEdge(store.selectedNode.id, store.currentProject, (node) => allNodeIds.push(node))
  console.log('inEdges', allNodeIds.map(id => store.currentProject.nodesMap.get(id).data.name));
}

function searchAll() {
  const allNodeIds = store.getRelationNodes(store.selectedNode.id, store.currentProject)
  console.log(
    'all',
    allNodeIds.map((id) => store.currentProject.nodesMap.get(id).data.name)
  )
}

function showDownNode() {
  const node = store.findDownNode(store.selectedNode.id, store.currentProject)
  console.log(node);
}

function showAllDownNode() {
  const nodes = store.findAllDownNode(store.selectedNode.id, store.currentProject)
  console.log(nodes.map(node => node.data.name));
}

function showRightNode() {
  const node = store.findRightNode(store.selectedNode.id, store.currentProject)
  console.log(node?.data.name)
}

function moveDown() {
  store.moveDown(store.selectedNode, store.currentProject)
}

</script>

<template>
  <teleport to="body">
    <div v-if="visible"
      :style="{ 'position': 'absolute', 'left': store.contextmenuPosition.x + 'px', 'top': store.contextmenuPosition.y + 'px' }"
      @contextmenu.prevent>
      <div class="menu" :ref="onRef" tabindex="0" @blur="onblur">
        <ul @click="onblur">
          <li @click="moveRight">右移</li>
          <li @click="moveLeft">左移</li>
          <li @click="moveDown">下移</li>
          <li @click="showNeighbors">邻节点</li>
          <li @click="searchOutEdges">出节点搜索</li>
          <li @click="searchInEdges">入节点搜索</li>
          <li @click="searchAll">全搜索</li>
          <li @click="showDownNode">下节点</li>
          <li @click="showAllDownNode">所有下节点</li>
          <li @click="showRightNode">右节点</li>
          <li @click="handleDelete">删除</li>
        </ul>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.menu {
  width: 120px;
  border-radius: 4px;
  padding: 4px 0;
  overflow: hidden;
  background: #606266;

  &:focus {
    outline: none;
  }
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