<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'
import { dateToX } from '@/utils/time'

const store = useStore()
const route = useRoute()
const currentProject = store.projects[route.params.id as string]

const visible = computed(() => {
  return store.actionState === 'contextmenu'
})

/**
 * Deletes a node from the graph based on the node ID stored in the
 * graph's userData.selectItem property.
 * Removes the node data from the graph and closes the context menu.
 */
function handleDelete() {
  store.removeNode(store.selectedNode.id,currentProject)
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
  store.moveRight(store.selectedNode.id, currentProject)
}

function moveLeft() {
  store.moveLeft(store.selectedNode.id, currentProject, dateToX(store.currentTime,currentProject.createTime))
}

function moveDown() {
  store.moveDown(store.selectedNode, currentProject)
}

function moveUp() {
  store.moveUp(store.selectedNode, currentProject)
}

const contextmenuRef = ref<HTMLElement>()

const contextmenuPosition = computed(() => {
  const height = document.body.getBoundingClientRect().height
  const width = document.body.getBoundingClientRect().width
  const menuWidth = contextmenuRef.value?.clientWidth || 0
  const menuHeight = contextmenuRef.value?.clientHeight || 0
  const maxHeight = (store.contextmenuPosition.y > height - menuHeight) ? height - menuHeight : store.contextmenuPosition.y
  const maxWidth = (store.contextmenuPosition.x > width - menuWidth) ? store.contextmenuPosition.x - menuWidth : store.contextmenuPosition.x
  return {
    left: maxWidth + 'px',
    top: maxHeight + 'px'
  }
})

</script>

<template>
  <teleport to="body">
    <div v-if="visible" class="contextmenu" :style="contextmenuPosition" @contextmenu.prevent :ref="onRef" tabindex="0"
      @blur="onblur" @click="onblur">
      <ul>
        <li @click="moveRight">单体右移</li>
        <li @click="moveLeft">单体左移</li>
        <li @click="moveUp">整体上移</li>
        <li @click="moveDown">整体下移</li>
        <li @click="handleDelete">删除</li>
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