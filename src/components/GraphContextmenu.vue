<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'

const contextmenuRef = ref<HTMLElement>()
const store = useStore()
const route = useRoute()
const currentProject = store.projects[route.params.id as string]

const visible = computed(() => {
  return store.actionState === 'node:contextmenu' || store.actionState === 'canvas:contextmenu' || store.actionState === 'edge:contextmenu'
})

const contextmenuPosition = computed(() => {
  const { height, width } = document.body.getBoundingClientRect()
  const { x, y } = currentProject.data.graph.getClientByCanvas(store.mousePosition)
  const { clientWidth, clientHeight } = contextmenuRef.value ?? { clientWidth: 0, clientHeight: 0 }
  const maxHeight = (y > height - clientHeight) ? height - clientHeight : y
  const maxWidth = (x > width - clientWidth) ? x - clientWidth : x
  return {
    left: maxWidth + 'px',
    top: maxHeight + 'px'
  }
})

/**
 * Deletes a node from the graph based on the node ID stored in the
 * graph's userData.selectItem property.
 * Removes the node data from the graph and closes the context menu.
 */
function handleDelete() {
  store.removeNode(store.selectedItem.id, currentProject)
}

function onblur() {
  store.actionState = 'none'
}

function onRef(e: any) {
  contextmenuRef.value = e
  setTimeout(() => {
    (e as HTMLElement)?.focus()
  })
}

function moveRight() {
  store.moveRight(store.selectedItem.id, currentProject)
}

function moveLeft() {
  store.moveLeft(store.selectedItem.id, currentProject)
}

function moveDown() {
  store.moveDown(store.selectedItem, currentProject)
}

function moveUp() {
  store.moveUp(store.selectedItem, currentProject)
}


function onCreateNode() {
  const { x, y } = store.mousePosition
  store.createNode(x, y, currentProject)
}

function onDeleteEdge() {
  store.removeEdge(store.selectedItem.id, currentProject)
}

function onAppend(){
  store.appendNode(store.selectedItem.id, currentProject)
}

function onInsert(){
  store.insertNode(store.selectedItem.id, currentProject)
}

</script>

<template>
  <teleport to="body">
    <div v-if="visible" class="contextmenu" :style="contextmenuPosition" @contextmenu.prevent :ref="onRef" tabindex="0"
         @blur="onblur" @click="onblur">
      <ul v-if="store.actionState==='node:contextmenu'">
        <li @click="onAppend">追加</li>
        <li @click="onInsert">插入</li>
        <li @click="moveRight">右移</li>
        <li @click="moveLeft">左移</li>
        <li @click="moveUp">整体上移</li>
        <li @click="moveDown">整体下移</li>
        <li @click="handleDelete">删除</li>
      </ul>
      <ul v-else-if="store.actionState==='edge:contextmenu'">
        <li @click="onDeleteEdge">删除</li>
      </ul>
      <ul v-else>
        <li @click="onCreateNode">新建</li>
      </ul>
    </div>
  </teleport>
</template>

<style scoped>
.contextmenu {
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0, 10, 0, 1);
  position: absolute;
  overflow: hidden;
  width: 120px;
  border-radius: 4px;
  padding: 4px 0;
  background: #606266;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  z-index: 1000;

  &:focus {
    outline: none;
    opacity: 1;
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