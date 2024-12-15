<script setup lang="ts">
import { useDataStore } from '@/stores';
import { computed } from 'vue';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { generateIndex } from '@/stores/data';
import BasePageLayout from '@/components/layout/BasePageLayout.vue';

const dataStore = useDataStore();

const tableData = computed(() => Array.from(dataStore.projectsMap.values()));

function createTestProject() {
  const projectId = v4();
  dataStore.addProject({
    description: faker.lorem.paragraph(),
    id: projectId,
    index: generateIndex(),
    name: faker.company.name(),
    x: 0,
    y: 0,
    createdAt: faker.date.past().getTime()
  });
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
          {{new Date(scope.row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button type="danger" size="small" @click="dataStore.removeProject(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </base-page-layout>
</template>

<style scoped></style>
