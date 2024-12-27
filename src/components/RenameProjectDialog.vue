<script setup lang="ts">
import type { Plan } from '@/stores';
import { emitter } from '@/utils';
import { nextTick, reactive, ref } from 'vue';

const dialogModel = reactive({
  visible: false,
  project: null as Plan | null
});

// 创建输入框的引用
const inputRef = ref<any>(null);

emitter.on('edite-project-name', (params) => {
  dialogModel.visible = true;
  dialogModel.project = params;
  
  // 使用 nextTick 确保对话框已经渲染
  nextTick(() => {
    // 聚焦输入框
    setTimeout(() => {
      inputRef.value?.focus();
    }, 100);
  });
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
    <el-input 
      ref="inputRef" 
      v-model="dialogModel.project.name" 
      placeholder="请输入项目名称" 
      @focus="inputRef.focus()"
      @blur="inputRef.blur()"
      @keyup.enter="handleRenameProject"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleRenameProject"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
