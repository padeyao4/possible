<script setup lang="ts">
import { computed, inject } from 'vue'

const graphRef = inject('graph') as any

const visible = computed(() => {
  return graphRef.value?.userData.status === 'contextmenu' ?? false
})

const position = computed(() => {
  const graph = graphRef.value
  if (!graph) return { x: 0, y: 0 }
  const position = graph.userData.pointerPosition
  return graph.getClientByCanvas(position)
})

function handleDelete() {
  const graph = graphRef.value
  const { userData } = graph
  const id = userData.selectItem.id
  graph.removeData('node', id)
}

</script>

<template>
  <teleport to="body">
    <div v-if="visible"
         :style="{'position': 'absolute','left':position.x+'px','top':position.y+'px'}"
         @contextmenu.prevent>
      <div class="menu" :ref="(e)=>(e as HTMLElement)?.focus()">
        <ul>
          <li @pointerdown="handleDelete">删除</li>
          <li>插入</li>
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