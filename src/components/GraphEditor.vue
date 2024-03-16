<script setup>
import { computed, inject } from 'vue'

const graph = inject('graph')

const visible = computed({
  get: () => {
    const { userData } = graph.value ?? { userData: { doubleNodeClick: false } }
    return userData.doubleNodeClick
  },
  set: (value) => {
    const { userData } = graph.value
    userData.doubleNodeClick = value
  }
})

const task = computed(() => {
  const { selectItem } = graph.value.userData

  return new Proxy(selectItem, {
    get: (target, p) => {
      return Reflect.get(target.data, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target.data, p, newValue)
      graph.value.updateData('node', target)
      return true
    }
  })
})
</script>

<template>
  <teleport to="body">
    <el-drawer
      v-model="visible"
      :close-on-click-modal="false"
      :show-close="true"
      modal-class="modal-class"
      @close="visible=false"
    >
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
          <el-radio :value="true" size="default" border>完成</el-radio>
          <el-radio :value="false" size="default" border>正常</el-radio>
        </el-radio-group>
      </el-form>
    </el-drawer>
  </teleport>
</template>

<style scoped>
</style>