<script setup lang="ts">
import { computed, ref } from 'vue'
import { IGraph } from '@antv/g6'

const props = defineProps<{
  nodeId: string | undefined
  resetNodeId: () => void
  graph: IGraph | undefined
}>()

const visible = computed({
  get: () => {
    return props.nodeId != undefined
  },
  set: () => {
    props.resetNodeId()
  }
})

const node = computed(() => {
  const model = ref(props.graph?.findById(props.nodeId as string)?.getModel() ?? {})
  return new Proxy(model.value as any, {
    get: (target, p) => {
      return Reflect.get(target, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target, p, newValue)
      props.graph?.updateItem(target.id, target)
      return true
    }
  })
})
</script>

<template>
  <el-drawer
    v-model="visible"
    :close-on-click-modal="false"
    :show-close="true"
    modal-class="modal-class"
    class="editor-class"
    @close="visible = false"
  >
    <el-form :model="node">
      <el-form-item label="名称">
        <el-input v-model="node.name" />
      </el-form-item>
      <el-form-item label="目标">
        <el-input v-model="node.target" />
      </el-form-item>
      <el-form-item label="详情">
        <el-input v-model="node.detail" type="textarea" />
      </el-form-item>
      <el-form-item label="记录">
        <el-input v-model="node.note" type="textarea" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="node.taskType">
          <el-radio label="general">一般</el-radio>
          <el-radio label="period">周期</el-radio>
          <el-radio label="schedule">定时</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="node.state">
          <el-radio label="normal">正常</el-radio>
          <el-radio label="completed">完成</el-radio>
          <el-radio label="timeout">超时</el-radio>
          <el-radio label="discard">放弃</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped></style>
