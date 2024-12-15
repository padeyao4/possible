<script setup lang="ts">
import { useDataStore } from '@/stores';
import { computed } from 'vue';

const dataStore = useDataStore();

const tableData = computed(() => Array.from(dataStore.projectsMap.values()));
</script>

<template>
  <div class="flex h-screen flex-col" style="background-color: #82bbb5">
    <div class="drag-region mb-3">
      <div class="flex w-full shrink-0 items-end px-3 text-xl text-gray-600" style="height: 52px">
        项目管理
      </div>
    </div>
    <el-scrollbar class="grow px-3" always>
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
    </el-scrollbar>
  </div>
</template>

<style scoped></style>
