<script setup>
import { inject } from 'vue'

const selected = inject('selected')
const current = inject('current')
const graph = inject('graph')

const task = new Proxy(current, {
  get: (target, p) => {
    return Reflect.get(target.value.data, p)
  },
  set: (target, p, newValue) => {
    Reflect.set(target.value.data, p, newValue)
    graph.value.updateData('node', {
      id: target.value.id,
      data: target.value.data
    })
    return true
  }
})
</script>

<template>
  <teleport to="body">
    <el-drawer
      v-model="selected"
      :close-on-click-modal="false"
      :show-close="true"
      modal-class="modal-class"
      @close="selected=false"
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