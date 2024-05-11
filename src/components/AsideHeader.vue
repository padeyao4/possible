<script setup lang="ts">
import { useSettings } from '@/stores/settings'
import { linkTo } from '@/stores/service/route-service'
import { Config, DeleteFour, Drag, ListSuccess, Plus, Sun, Bookmark, Write, AllApplication } from '@icon-park/vue-next'

const settings = useSettings()

function onclick(path: string) {
  setTimeout(() => {
    linkTo(path)
  })
}

</script>

<template>
  <div id="aside-header">
    <div class="side-list-item" data-path="today" @click="onclick('/today')">
      <sun theme="multi-color" size="20" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="3"
           strokeLinecap="butt" class="side-icon" />
      <div class="side-item-text">
        我的一天
      </div>
    </div>
    <div class="side-list-item" data-path="backlog" @click="onclick('/backlog')">
      <bookmark theme="outline" size="20" fill="#333" :strokeWidth="3" strokeLinecap="butt" class="side-icon" />
      <div class="side-item-text">
        备忘录
      </div>
    </div>
    <div class="side-list-item" data-path="manage" @click="onclick('/manage')">
      <all-application theme="outline" size="20" fill="#333" :strokeWidth="3" strokeLinecap="butt" class="side-icon" />
      <div class="side-item-text">
        任务管理
      </div>
    </div>
  </div>
</template>

<style scoped>
#aside-header {
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  margin-top: 24px;

  & > * {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 4px;
    margin: 4px 12px;
    user-select: none;
  }
}
</style>