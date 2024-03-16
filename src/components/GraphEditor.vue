<script setup>
import { computed, inject } from 'vue'

const graphRef = inject('graph')

const visible = computed({
  get: () => {
    const { userData } = graphRef.value ?? { userData: { status: 'none' } }
    return userData.status === 'edit'
  },
  set: (value) => {
    const { userData } = graphRef.value
    userData.status = value ? 'edit' : 'none'
  }
})

const task = computed(() => {
  const { selectItem } = graphRef.value.userData

  return new Proxy(selectItem, {
    get: (target, p) => {
      return Reflect.get(target.data, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target.data, p, newValue)
      graphRef.value.updateData('node', target)
      return true
    }
  })
})

/**
 * Computed property that returns a boolean indicating if the node is enabled.
 * Checks if all predecessor nodes are completed by getting all predecessors
 * via graph.getAllPredecessors() and checking if their 'completed' data is true.
 */
const enable = computed(() => {
  const graph = graphRef.value
  const { userData } = graph
  const nodeId = userData.selectItem.id
  const models = graph.getAllPredecessors(nodeId)
  return models.every((model) => model.data.completed)
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
          <el-radio :value="true" :disabled="!enable" size="default" border>完成</el-radio>
          <el-radio :value="false" size="default" border>正常</el-radio>
        </el-radio-group>
      </el-form>
    </el-drawer>
  </teleport>
</template>

<style scoped></style>