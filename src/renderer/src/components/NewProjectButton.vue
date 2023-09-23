<script lang="ts" setup>
import '@renderer/assets/icon/iconfont.css'
import router from '@renderer/router'
import { useGlobalStore } from '@renderer/store/global'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

const formRef = ref<FormInstance>()

const store = useGlobalStore()

const dialogVisible = ref<boolean>(false)

const nameValue = ref({
  input: ''
})

function handleDialogOpen() {
  nameValue.value.input = ''
  dialogVisible.value = true
}

const handleDialogSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      const project = store.createProjectByName(nameValue.value.input)
      project.offset.x =
        -Math.floor((new Date().valueOf() - new Date('2023/9/1').valueOf()) / 86400000) * 120
      dialogVisible.value = false
      router.push({
        name: 'summery'
      })
      store.active = project.id
      return true
    } else {
      return false
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建项目"
    width="30%"
    :draggable="true"
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="nameValue" @submit.prevent="true">
      <el-form-item prop="input" :rules="[{ required: true, message: 'project name is required' }]">
        <el-input v-model="nameValue.input" type="text" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleDialogSubmit(formRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <div style="user-select: none" class="new-button" @click="handleDialogOpen">
    <el-icon :size="20">
      <Plus />
    </el-icon>
    <div style="padding: 0 0 2px 4px">新建项目</div>
  </div>
</template>

<style scoped>
.new-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: calc(100vh - 42px);
  background: var(--color-bronze);
  width: 100%;
  height: 40px;
}
</style>
