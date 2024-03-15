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
  <div>
    <main>
      <div class="content">
        <header>
          <div id="main-title">已完成项目</div>
        </header>
        <section>
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
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #82bbb5;
}

.content {
  flex-grow: 1;
  padding: 24px 24px 0 24px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}


header {
  height: 32px;
}

section {
  height: calc(100vh - 64px - 48px);
  width: calc(100vw - 240px - 24px * 2);
  overflow-y: auto;
  margin: 24px 0;
}


#main-title {
  display: flex;
  align-items: center;
  font-size: 20px;
}

</style>
