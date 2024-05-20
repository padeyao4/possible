<script setup lang="ts">
import { useProjects } from '@/stores/projects'
import { createProjectTemplate } from '@/stores/service/project.service'
import { linkTo } from '@/stores/service/route.service'

function onclick() {
  const project = createProjectTemplate()
  useProjects().addProject(project)
  setTimeout(() => {
    linkTo('/index/project/' + project.id)
    project.editable = true
  })
}

function handleSettings() {
  console.log('hello world')
}
</script>

<template>
  <div id="aside-footer">
    <div class="side-list-item add" data-hover @click="onclick">
      <my-icon icon="solar:add-square-broken" class="side-icon" />
      <div class="side-item-text">创建项目</div>
    </div>
    <div class="splite"></div>
    <div class="side-list-item settings" @click="handleSettings">
      <my-icon icon="solar:settings-broken" />
    </div>
  </div>
</template>

<style scoped>
#aside-footer {
  display: flex;
  flex-direction: row;
  height: 48px;
  box-shadow:
    rgba(27, 31, 35, 0.06) 0 -1px 0,
    rgba(255, 255, 255, 0.25) 0 -1px 0 inset;

  & > *:first-child {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 4px;
    margin: 4px;
  }

  .splite {
    border-left: 1px solid #00000010;
  }

  & > *:last-child {
    display: flex;
    align-items: center;
    height: 40px;
    width: 40px;
    padding: 4px;
    margin: 4px;
  }

  .add {
    flex-grow: 1;
  }

  .settings {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 8px;
    & > * {
      width: 24px;
      height: 24px;
      border-radius: 8px;
    }
    &:hover {
      background-color: burlywood;
    }
  }
}
</style>
