<script setup lang="ts">
import BasePageLayout from '@/components/layout/BasePageLayout.vue';
import { usePlanStore } from '@/stores';
import { generateIndex } from '@/stores/data';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { computed } from 'vue';

const planStore = usePlanStore();

const tableData = computed(() => planStore.projects);

function createTestProject() {
  const projectId = v4();
  planStore.addPlan({
    id: projectId,
    name: faker.company.name(),
    createdAt: faker.date.past().getTime(),
    index: generateIndex(),
    offsetX: 0,
    offsetY: 0,
  }, true);
  const nodeId = v4();
  planStore.addPlan({
    id: nodeId,
    name: faker.company.name(),
    createdAt: faker.date.past().getTime(),
    index: generateIndex(),
    parentId: projectId,
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  });
  const node2Id = v4();
  planStore.addPlan({
    id: node2Id,
    name: faker.company.name(),
    createdAt: faker.date.past().getTime(),
    index: generateIndex(),
    parentId: projectId,
    x: 3,
    y: 0,
    width: 1,
    height: 1,
  });
  planStore.addRelation(nodeId, node2Id);
}
</script>

<template>
  <base-page-layout title="项目管理">
    <div class="mb-3 flex justify-end">
      <el-button type="primary" @click="createTestProject">
        <span class="icon-[mdi--plus] mr-1" />
        创建测试项目
      </el-button>
    </div>
    <el-table :data="tableData">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="id" label="项目ID" width="300" />
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="scope">
          {{ new Date(scope.row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button type="danger" size="small" @click="planStore.removePlan(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </base-page-layout>
</template>

<style scoped></style>
