<script lang="ts" setup>
import {type ITask, useGlobalStore} from "@/store/global";
import {ElInput} from "element-plus";
import {nextTick} from "vue";

const props = defineProps<{
  visible: boolean,
  taskId?: string
}>()

let emit = defineEmits(['update:visible'])

const value = $computed({
  get: () => {
    return props.visible
  },
  set: (v) => {
    emit('update:visible', v)
  }
})

const store = useGlobalStore()

const currentTask = $computed(() => {
  return store.currentProjectTasks.find(t => t.id === props.taskId)
})

let headerInputVisible = $ref(false)

const handleHeaderInputConfirm = () => {
  console.log('header input')
  headerInputVisible = false
}

let headerInputRef = $ref<InstanceType<typeof ElInput>>()
const showHeaderInput = () => {
  headerInputVisible = true
  nextTick(() => {
    headerInputRef?.input!.focus()
  })
}

let currentTaskTile = $computed({
  get: () => {
    return currentTask?.name ?? ''
  },
  set: (title: string) => {
    store.setCurrentProjectTask({
      id: props?.taskId ?? '',
      name: title
    } as ITask)
  }
})

</script>

<template>
  <el-drawer v-model="value"
             :close-on-click-modal="false"
             :show-close="false"
             @close="()=>{console.log('do close',value)}"
  >
    <template #header>
      <el-input ref="headerInputRef"
                v-if="headerInputVisible"
                v-model="currentTaskTile"
                size="large"
                @keyup.enter="handleHeaderInputConfirm"
                @blur="handleHeaderInputConfirm"/>
      <h3 v-else @click="showHeaderInput">{{ currentTask?.name ?? '' }}</h3>
    </template>
    <template #footer>
      <el-button-group>
        <el-button>cancel</el-button>
        <el-button>enter</el-button>
      </el-button-group>
    </template>
  </el-drawer>
</template>

<style scoped>
</style>