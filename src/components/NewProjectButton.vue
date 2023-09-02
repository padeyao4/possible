<script lang="ts" setup>
import router from "@/router";
import {useGlobalStore} from "@/store/global";

const store = useGlobalStore()

let dialogVisible = $ref<boolean>(false)

let nameValue = $ref({
  input: ''
})

function handleDialogOpen() {
  nameValue.input = ''
  dialogVisible = true
}

function handleDialogSubmit() {
  let project = store.createProjectByName(nameValue.input)
  project.offset.x = -Math.floor(new Date().valueOf() / 86400000) * 120
  dialogVisible = false
  router.push({
    name: 'summery',
  })
  store.active = project.id
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
    <el-form :model="nameValue" @submit="handleDialogSubmit" @submit.prevent>
      <el-form-item>
        <el-input v-model="nameValue.input" type="text" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <button @click="handleDialogOpen">
    新建项目
  </button>
</template>