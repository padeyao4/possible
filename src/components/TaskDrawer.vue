<script lang="ts" setup>
import {type ITask, useGlobalStore} from "@/store/global";
import {ElInput} from "element-plus";
import {nextTick} from "vue";
import type {Graph} from "@antv/g6";

const props = defineProps<{
  visible: boolean,
  taskId: string,
  graph: Graph
}>()

let emit = defineEmits(['update:visible'])

let modelValue = $computed({
  get: () => {
    return props.visible
  },
  set: (v) => {
    emit("update:visible", v)
  }
})

const store = useGlobalStore()

let titleInputVisible = $ref(false)

const handleTitleInputConfirm = () => {
  console.log('header input')
  titleInputVisible = false
}

let titleInputRef = $ref<InstanceType<typeof ElInput>>()
const showTitleInput = () => {
  titleInputVisible = true
  nextTick(() => {
    titleInputRef?.input!.focus()
  })
}

let currentTaskTile = $computed({
  get: () => {
    if (props.visible) {
      let item = props.graph.findById(props.taskId);
      return item.getModel().label as string
    } else {
      return ''
    }
  },
  set: (title: string) => {
    let item = props.graph.findById(props.taskId);
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
  modelValue = false
}

</script>

<template>
  <el-drawer v-model="modelValue"
             :close-on-click-modal="false"
             :show-close="true"
             @close="handleClose"
  >
    <div>
      <el-input ref="titleInputRef"
                v-if="titleInputVisible"
                v-model="currentTaskTile"
                size="small"
                @keyup.enter="handleTitleInputConfirm"
                @blur="handleTitleInputConfirm"/>
      <p v-else @click="showTitleInput">{{ currentTaskTile }}</p>
    </div>
  </el-drawer>
</template>