<script setup lang="ts">
import { reactive } from 'vue';
import { type Project } from '@/stores';
import { emitter } from '@/utils';

const dialogModel = reactive({
  visible: false,
  project: <Project>undefined
});

emitter.on('edite-project-name', (params) => {
  dialogModel.visible = true;
  dialogModel.project = params;
});

function handleRenameProject() {
  dialogModel.visible = false;
}

function handleCancel() {
  dialogModel.visible = false;
}
</script>

<template>
  <el-dialog
    v-if="dialogModel.project"
    v-model="dialogModel.visible"
    title="修改项目名称"
    width="300"
    align-center
    style="border-radius: 6px !important"
  >
    <el-input v-model="dialogModel.project.name" placeholder="请输入项目名称" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleRenameProject"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
