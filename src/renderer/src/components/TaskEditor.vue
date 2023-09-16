<script lang="ts" setup>
import { type ITask, useGlobalStore } from '@renderer/store/global'
import { ElInput } from 'element-plus'
import { computed, nextTick, ref } from 'vue'
import type { Graph } from '@antv/g6'

const props = defineProps<{
  visible: boolean
  taskId: string
  graph: Graph
}>()

const emit = defineEmits(['update:visible'])

const modelValue = computed({
  get: () => {
    return props.visible
  },
  set: (v) => {
    emit('update:visible', v)
  }
})

const store = useGlobalStore()

const titleInputVisible = ref(false)

const handleTitleInputConfirm = () => {
  console.log('header input')
  titleInputVisible.value = false
}

const titleInputRef = ref<InstanceType<typeof ElInput>>()
const showTitleInput = () => {
  titleInputVisible.value = true
  nextTick(() => {
    titleInputRef.value?.input?.focus()
  })
}

const currentTaskTile = computed({
  get: () => {
    if (props.visible) {
      const item = props.graph.findById(props.taskId)
      return item.getModel().label as string
    } else {
      return ''
    }
  },
  set: (title: string) => {
    const item = props.graph.findById(props.taskId)
    props.graph.updateItem(item, {
      label: title
    })
    store.setCurrentProjectTask({
      id: props?.taskId ?? '',
      name: title
    } as ITask)
  }
})

const handleClose = () => {
  modelValue.value = false
}
</script>

<template>
  <el-drawer
    v-model="modelValue"
    :close-on-click-modal="false"
    :show-close="true"
    @close="handleClose"
  >
    <div>
      <el-input
        v-if="titleInputVisible"
        ref="titleInputRef"
        v-model="currentTaskTile"
        size="small"
        @keyup.enter="handleTitleInputConfirm"
        @blur="handleTitleInputConfirm"
      />
      <p v-else @click="showTitleInput">{{ currentTaskTile }}</p>
    </div>
  </el-drawer>
</template>
