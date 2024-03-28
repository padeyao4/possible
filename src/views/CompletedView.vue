<script setup lang="ts">
import { useStore } from '@/stores/store'
import { computed, ref } from 'vue'

const store = useStore()

const search = ref('')

const filterTableData = computed(() => {
    return Object.values(store.projects)
      .filter(project => project.completed)
      .filter((data) =>
        !search.value ||
        data.name.toLowerCase().includes(search.value.toLowerCase())
      )
  }
)

const handleEdit = (index: number, row: any) => {
  row.completed = false
}
const handleDelete = (index: number, row: any) => {
  delete store.projects[row.id]
}

function formatDate(e: any) {
  return new Date(e.createTime).toLocaleString()
}

</script>

<template>
  <div id="completed-view">
    <header>
      已完成项目
    </header>
    <main>
      <el-table :data="filterTableData" style="width: 100%; height: 100%; border-radius: 4px">
        <el-table-column label="时间" prop="createTime" :formatter="formatDate" />
        <el-table-column label="名称" prop="name" />
        <el-table-column align="right">
          <template #header>
            <el-input v-model="search" size="small" placeholder="输入名称" />
          </template>
          <template #default="scope">
            <el-popconfirm title="删除当前项目吗"
                           :hide-after=0
                           @confirm="handleDelete(scope.$index, scope.row)">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<style scoped>
#completed-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #8cb6c5;
}

header {
  display: flex;
  align-items: center;
  font-size: 20px;
  height: 40px;
  margin: 24px;
}

main {
  height: calc(100vh - 24px * 3 - 40px);
  width: calc(100vw - 240px - 24px * 2);
  overflow-y: auto;
  margin: 0 24px 24px 24px;
}
</style>
