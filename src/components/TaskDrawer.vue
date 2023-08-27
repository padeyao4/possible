<script lang="ts" setup>
import {type ITask, useGlobalStore} from "@/store/global";
import {ElInput} from "element-plus";
import {nextTick} from "vue";

const props = defineProps<{
  visible: boolean,
  taskId?: string
}>()

let emit = defineEmits(['update:visible'])

let modelValue = $computed({
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

const handleClose = () => {
  modelValue = false
}

const handleDeleteTask = () => {
  if (props.taskId) {
    store.deleteCurrentProjectTaskById(props.taskId)
    modelValue = false
  }
}

</script>

<template>
  <el-drawer v-model="modelValue"
             :close-on-click-modal="false"
             :show-close="false"
             @close="handleClose"
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
    <p>{{ currentTask?.id}}</p>
    <template #footer>
      <div class="footer">
        <el-button type="danger" round @click="handleDeleteTask">删除</el-button>
        <el-button-group>
          <el-button @click="handleClose" type="primary">确定</el-button>
        </el-button-group>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
}
</style>