<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import type { CustomGraph } from '@/g6/core/graph'
import { useStore } from '@/stores/store'

const store = useStore()

const graphRef = inject<Ref<CustomGraph>>('graph')

const visible = computed({
  get: () => {
    return store.actionState === 'edit'
  },
  set: (value) => {
    store.actionState = value ? 'edit' : 'none'
  }
})


const task = computed<Record<any, any>>(() => {
  const data = store.selectedNode.data

  return new Proxy(data, {
    get: (target, p) => {
      return Reflect.get(target, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target, p, newValue)
      store.updateData('node', {
        id: store.selectedNode.id,
        data: target
      })
      return true
    }
  })
})

/**
 * Computed property that returns a boolean indicating if the node is enabled.
 * Checks if all predecessor nodes are completed by getting all predecessors
 * via graph.getAllPredecessors() and checking if their 'completed' data is true.
 */
const isCompleted = computed(() => {
  const graph = graphRef!.value
  const nodeId = store.selectedNode.id
  const models = graph.getAllPredecessors(nodeId)
  return models.every((model) => model.data.completed)
})

/**
 * Computed property that returns a boolean indicating if the node is pending.
 * Checks if any successor nodes are not completed by getting all successors
 * via graph.getAllSuccessors() and checking if their 'completed' data is false.
 */
const isPending = computed(() => {
  const graph = graphRef!.value
  const nodeId = store.selectedNode.id
  const models = graph.getAllSuccessors(nodeId)
  return models.every((model) => !model.data.completed)
})

</script>

<template>
  <teleport to="body">
    <el-drawer v-model="visible" :close-on-click-modal="false" :show-close="true" modal-class="modal-class"
               @close="visible = false">
      <el-form :model="task" @submit.prevent>
        <el-form-item label="名称">
          <el-input v-model="task.name" />
        </el-form-item>
        <el-form-item label="详情">
          <el-input v-model="task.detail" type="textarea" />
        </el-form-item>
        <el-form-item label="记录">
          <el-input v-model="task.record" type="textarea" />
        </el-form-item>
        <el-radio-group v-model="task.completed">
          <el-radio :value="true" :disabled="!isCompleted" size="default" border>完成</el-radio>
          <el-radio :value="false" :disabled="!isPending" size="default" border>正常</el-radio>
        </el-radio-group>
      </el-form>
    </el-drawer>
  </teleport>
</template>

<style scoped></style>