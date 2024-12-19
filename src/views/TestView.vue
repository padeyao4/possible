<script setup lang="ts">
import BasePageLayout from '@/components/layout/BasePageLayout.vue';
import { usePlanStore, type Plan } from '@/stores';
import { generateIndex } from '@/stores/layout';
import { faker } from '@faker-js/faker';
import { ElNotification } from 'element-plus';
import { v4 } from 'uuid';
import { computed, h, ref } from 'vue';

const planStore = usePlanStore();
const multipleSelection = ref<any[]>([]);

const tableData = computed(() => planStore.projects);

function handleSelectionChange(val: any[]) {
  multipleSelection.value = val;
}

const dialogVisible = ref(false);

async function handleBatchDelete() {
  if (multipleSelection.value.length === 0) return;
  dialogVisible.value = true;
}

function handleConfirm() {
  multipleSelection.value.forEach(item => {
    planStore.removePlan(item.id);
  });
  multipleSelection.value = [];
  dialogVisible.value = false;
}

function handleCancel() {
  dialogVisible.value = false;
}

function createTestProject() {
  // 创建项目节点
  const project = {
    id: v4(),
    name: faker.company.name(),
    createdAt: faker.date.past().getTime(),
    index: generateIndex(),
    x: 0,
    y: 0,
    isExpand: true,
  };
  planStore.addPlan(project, true);
  // 创建10-20个随机plan
  const planCount = faker.number.int({ min: 10, max: 20 });
  const plans = [] as Plan[];
  const usedPositions = new Set(); // 记录已使用的位置

  // 辅助函数:检查位置是否可用
  function isPositionAvailable(x: number, y: number, width: number, height: number) {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (usedPositions.has(`${i},${j}`)) return false;
      }
    }
    return true;
  }

  // 辅助函数:标记位置已使用
  function markPosition(x: number, y: number, width: number, height: number) {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        usedPositions.add(`${i},${j}`);
      }
    }
  }

  // 创建基础plan节点
  for (let i = 0; i < planCount; i++) {
    let x, y;
    do {
      x = faker.number.int({ min: -5, max: 40 });
      y = faker.number.int({ min: 0, max: 10 });
    } while (!isPositionAvailable(x, y, 1, 1));

    markPosition(x, y, 1, 1);

    const plan = {
      id: v4(),
      name: faker.company.catchPhrase(),
      createdAt: faker.date.past().getTime(),
      index: generateIndex(),
      x,
      y,
      width: 1,
      height: 1,
      isDone: faker.datatype.boolean(),
      parentId: project.id
    };
    plans.push(plan);
    planStore.addPlan(plan);
  }

  // 为30%的plan添加子节点
  const parentsCount = Math.floor(planCount * 0.3);
  const parentPlans = faker.helpers.shuffle(plans).slice(0, parentsCount);

  parentPlans.forEach(parentPlan => {
    const childCount = faker.number.int({ min: 1, max: 3 });
    const parentX = parentPlan.x;
    const parentY = parentPlan.y;
    let maxWidth = 1;
    let maxHeight = 1;

    // 为父节点添加子节点
    for (let i = 0; i < childCount; i++) {
      let x, y;
      do {
        x = faker.number.int({ min: parentX!, max: parentX! + 2 });
        y = faker.number.int({ min: parentY! + 1, max: parentY! + 3 });
      } while (!isPositionAvailable(x, y, 1, 1));

      markPosition(x, y, 1, 1);
      maxWidth = Math.max(maxWidth, x - parentX! + 1);
      maxHeight = Math.max(maxHeight, y - parentY! + 1);

      const childPlan = {
        id: v4(),
        name: faker.company.catchPhrase(),
        createdAt: faker.date.past().getTime(),
        index: generateIndex(),
        x: x - parentX!,
        y: y - parentY!,
        width: 1,
        height: 1,
        isDone: faker.datatype.boolean(),
        parentId: parentPlan.id
      };
      planStore.addPlan(childPlan);
    }

    // 更新父节点尺寸以包围子节点
    parentPlan.width = maxWidth;
    parentPlan.height = maxHeight;
    // planStore.updatePlan(parentPlan);
  });

  // 为60%的plan添加连接关系
  const connectionsCount = Math.floor(planCount * 0.6);
  const plansToConnect = faker.helpers.shuffle(plans).slice(0, connectionsCount);

  plansToConnect.forEach(plan => {
    const availablePlans = plans.filter(p =>
      p.id !== plan.id &&
      !p.parentId &&
      !planStore.hasRelation(plan.id, p.id)
    );

    if (availablePlans.length > 0) {
      const targetPlan = faker.helpers.arrayElement(availablePlans);
      planStore.addRelation(plan.id, targetPlan.id);
    }
  });
}

function testNotify() {
}

</script>

<template>
  <base-page-layout title="项目管理">
    <el-button type="success" @click="testNotify">测试通知</el-button>
    <el-dialog v-model="dialogVisible" title="批量删除" width="30%" center :close-on-click-modal="false">
      <span>确定要删除选中的 {{ multipleSelection.length }} 个项目吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="mb-3 flex justify-between items-center">
      <el-button type="danger" :disabled="multipleSelection.length === 0" @click="handleBatchDelete">
        <span class="icon-[mdi--delete-sweep] mr-1" />
        批量删除
      </el-button>

      <el-button type="primary" @click="createTestProject">
        <span class="icon-[mdi--plus] mr-1" />
        创建测试项目
      </el-button>
    </div>

    <el-table :data="tableData" class="custom-table" :header-cell-style="{
      background: '#f5f7fa',
      color: '#606266',
      fontWeight: 500
    }" :cell-style="{
      color: '#606266'
    }" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="项目名称">
        <template #default="scope">
          <div class="flex items-center">
            <span class="icon-[mdi--folder-outline] mr-2 text-blue-500" />
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="项目ID" width="300">
        <template #default="scope">
          <span class="font-mono text-gray-500">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="scope">
          <span class="text-gray-600">
            {{ new Date(scope.row.createdAt).toLocaleString() }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template #default="scope">
          <el-button type="danger" size="small" class="delete-btn" @click="planStore.removePlan(scope.row.id)">
            <span class="icon-[mdi--delete-outline] mr-1" />
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </base-page-layout>
</template>

<style scoped>
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.custom-table :deep(th.el-table__cell) {
  background-color: #f5f7fa !important;
}

.custom-table :deep(th.el-table__cell:first-child) {
  border-top-left-radius: 8px;
}

.custom-table :deep(th.el-table__cell:last-child) {
  border-top-right-radius: 8px;
}

.custom-table :deep(.el-table__row:last-child td:first-child) {
  border-bottom-left-radius: 8px;
}

.custom-table :deep(.el-table__row:last-child td:last-child) {
  border-bottom-right-radius: 8px;
}

.delete-btn {
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #f56c6c;
  color: white;
  box-shadow: 0 4px 8px rgba(245, 108, 108, 0.2);
}

:deep(.custom-message-box) {
  border-radius: 8px;
  padding: 20px;
  min-width: 420px;
}

:deep(.custom-message-box .el-message-box__header) {
  padding-bottom: 15px;
}

:deep(.custom-message-box .el-message-box__title) {
  font-size: 18px;
  font-weight: 600;
}

:deep(.custom-message-box .el-message-box__content) {
  padding: 20px 0;
  font-size: 14px;
  color: #606266;
}

:deep(.custom-message-box .el-message-box__btns) {
  padding-top: 15px;
}

:deep(.custom-confirm-button) {
  background-color: #f56c6c;
  border-color: #f56c6c;
  padding: 8px 20px;
}

:deep(.custom-confirm-button:hover) {
  background-color: #f78989;
  border-color: #f78989;
}

:deep(.custom-cancel-button) {
  padding: 8px 20px;
}

:deep(.el-button) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

:deep(.el-button:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

:deep(.el-button--primary:hover) {
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
}

:deep(.el-button--danger:hover) {
  box-shadow: 0 4px 8px rgba(245, 108, 108, 0.2);
}
</style>
