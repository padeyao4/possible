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
  store.removeData('node', store.selectedNode.id)
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
  const id = store.selectedNode.id
  store.moveRight(id)
}

function moveLeft() {
  const id = store.selectedNode.id
  store.moveLeft(id)
}

function test() {
  const id = store.selectedNode.id
  console.log('pre', store.getPredecessors(id, store.currentProject).map(n => n.data.name))
  console.log('suc', store.getSuccessors(id, store.currentProject).map(n => n.data.name))
  console.log('all', store.getNeighbors(id, store.currentProject).map(n => n.data.name))
}

</script>

<template>
  <teleport to="body">
    <div v-if="visible" class="graph-contextmenu-container"
      :style="{ 'position': 'absolute', 'left': store.contextmenuPosition.x + 'px', 'top': store.contextmenuPosition.y + 'px' }"
      @contextmenu.prevent>
      <div class="menu" :ref="onRef" tabindex="0" @blur="onblur">
        <ul @click="onblur">
          <li @click="handleDelete">删除</li>
          <li @click="moveRight">右移</li>
          <li @click="moveLeft">左移</li>
          <li @click="test">信息</li>
        </ul>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
/** todo
*/
.graph-contextmenu-container {
  &:focus {
    border: none;
    border-style: none;
  }
}

.menu {
  width: 80px;
  border-radius: 4px;
  padding: 4px 0;
  overflow: hidden;
  background: #606266;

  &:focus {
    border: none;
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