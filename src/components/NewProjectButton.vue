<script lang="ts" setup>
import router from "@/router";
import {useGlobalStore} from "@/store/global";
import type {FormInstance} from 'element-plus'
import {ref} from "vue";

const formRef = ref<FormInstance>()

const store = useGlobalStore()

let dialogVisible = ref<boolean>(false)

let nameValue = ref({
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
      let project = store.createProjectByName(nameValue.value.input)
      project.offset.x = -Math.floor((new Date().valueOf() - new Date('2023/9/1').valueOf()) / 86400000) * 120
      dialogVisible.value = false
      router.push({
        name: 'summery',
      })
      store.active = project.id
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
      <el-form-item
          prop="input"
          :rules="[
              { required: true, message: 'project name is required' },
        ]"
      >
        <el-input v-model="nameValue.input" type="text" autocomplete="off" autofocus="true"
                  @keydown.enter=""></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleDialogSubmit(formRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <button @click="handleDialogOpen" style="user-select: none">
    新建项目
  </button>
</template>