<template>
  <div class="main">
    <el-dialog
        v-model="dialogVisible"
        title="创建项目"
        width="30%"
        :draggable="true"
        :destroy-on-close="true"
        :close-on-click-modal="false"
    >
      <el-form :model="createProjectValue" @submit="handleDialogSubmit" @submit.prevent>
        <el-form-item>
          <el-input v-model="createProjectValue.input" type="text" autocomplete="off"></el-input>
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
    <div class="side">
      <button>
        <RouterLink :to="{name: 'home'}">
          我的一天
        </RouterLink>
      </button>
      <hr/>
      <div class="list">
        <div v-for="item in store.projects">
          <button class="item" @click="handleListClick(item.id)" :class="{active:item.id===store.active}"
                  :key="item.id">{{ item.name }}
          </button>
        </div>
      </div>
      <button @click="handleDialogOpen">
        新建项目
      </button>
    </div>
    <div class="content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import store from "./store"
import router from "@/router";
import {ref} from "vue";

const dialogVisible = ref(false)

const createProjectValue = ref({
  input: ''
})

function handleDialogOpen() {
  createProjectValue.value.input = ''
  dialogVisible.value = true
}

function handleDialogSubmit() {
  let project = store.addProject(createProjectValue.value.input)
  dialogVisible.value = false
  router.push({
    name: 'summery',
    params: {
      projectKey: project.id
    }
  })
  store.active = project.id
}

function handleListClick(key: string) {
  router.push({
    name: 'summery',
    params: {
      projectKey: key
    }
  })
  store.active = key
}

</script>

<style scoped>
.main {
  display: grid;
  width: 100vw;
  grid-template-columns: 240px calc( 100vw - 240px );
}

.side {
  display: grid;
  background: rgb(99, 94, 94);
  color: rgb(124, 97, 97);

  & hr {
    height: 1px;
    border: none;
    border-top: 1px solid #323232;
  }
}

.list {
  overflow-y: auto;
  height: calc(100vh - 120px);

  .item {
    width: 100%;
    height: 40px;
  }

  .active {
    background-color: burlywood;
  }
}

.content {
  background-color: rgb(73, 57, 57);
  height: 100vh;
}
</style>