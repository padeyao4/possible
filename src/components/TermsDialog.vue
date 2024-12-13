<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)

const showDialog = () => {
  dialogVisible.value = true
}

defineExpose({
  showDialog
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="65%"
    class="terms-dialog"
  >
    <div class="terms-content text-gray-600">
      <section class="mb-8">
        <h2 class="mb-6 text-2xl font-medium text-gray-800">服务条款</h2>
        <div class="space-y-4">
          <p class="text-base leading-relaxed">欢迎使用 Possible！在使用我们的服务之前，请仔细阅读以下条款：</p>
          <div class="space-y-4">
            <div>
              <h3 class="mb-2 text-lg font-medium text-gray-700">1. 服务说明</h3>
              <p class="text-base leading-relaxed">Possible 是一个目标管理工具，旨在帮助用户更好地规划和追踪个人目标。</p>
            </div>
            <div>
              <h3 class="mb-2 text-lg font-medium text-gray-700">2. 用户责任</h3>
              <p class="text-base leading-relaxed">用户应对账号安全负责，不得将账号用于非法或违规用途。</p>
            </div>
            <div>
              <h3 class="mb-2 text-lg font-medium text-gray-700">3. 知识产权</h3>
              <p class="text-base leading-relaxed">本服务的所有权利均归 Possible 所有。用户创建的内容归用户所有。</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="mb-6 text-2xl font-medium text-gray-800">隐私政策</h2>
        <div class="space-y-4">
          <div>
            <h3 class="mb-2 text-lg font-medium text-gray-700">1. 信息收集</h3>
            <p class="mb-2 text-base leading-relaxed">我们仅收集必要的用户信息，包括：</p>
            <ul class="ml-6 list-disc space-y-1 text-base leading-relaxed">
              <li>GitHub 账号基本信息</li>
              <li>用户创建的目标和任务数据</li>
            </ul>
          </div>
          
          <div>
            <h3 class="mb-2 text-lg font-medium text-gray-700">2. 信息使用</h3>
            <p class="mb-2 text-base leading-relaxed">我们承诺：</p>
            <ul class="ml-6 list-disc space-y-1 text-base leading-relaxed">
              <li>不会向第三方出售您的个人信息</li>
              <li>仅将信息用于服务提供和改进</li>
              <li>采取合理措施保护您的数据安全</li>
            </ul>
          </div>

          <div>
            <h3 class="mb-2 text-lg font-medium text-gray-700">3. 数据存储</h3>
            <p class="text-base leading-relaxed">您的数据将安全存储在我们的服务器上，您可以随时导出或删除数据。</p>
          </div>
        </div>
      </section>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">我知道了</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.terms-content {
  max-height: 65vh;
  overflow-y: auto;
  padding: 0 1.5rem;
  line-height: 1.6;
}

:deep(.el-dialog__title) {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1f2937;
}

:deep(.el-dialog__header) {
  padding: 1.5rem;
  margin-right: 0;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-dialog__footer) {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

:deep(.el-dialog__body) {
  padding: 1.5rem 0;
}
</style> 