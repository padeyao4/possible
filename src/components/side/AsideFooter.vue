<script setup lang="ts">
import { Plus } from '@icon-park/vue-next'
import { addProject, createProjectTemplate } from '@/stores/service/project-service'
import { linkTo } from '@/stores/service/route-service'

function onclick() {
  const project = createProjectTemplate()
  addProject(project)
  setTimeout(() => {
    linkTo('/project/' + project.id)
    project.editable = true
  })
}
</script>

<template>
  <div id="aside-footer">
    <div class="side-list-item" data-hover @click="onclick">
      <plus theme="outline" size="20" fill="#333" :strokeWidth="3" strokeLinecap="butt" class="side-icon" />
      <div class="side-item-text">
        创建项目
      </div>
    </div>
  </div>
</template>

<style scoped>
#aside-footer {
  height: 48px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 -1px 0,
  rgba(255, 255, 255, 0.25) 0 -1px 0 inset;

  & > * {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 4px;
    margin: 4px 12px;
  }
}
</style>