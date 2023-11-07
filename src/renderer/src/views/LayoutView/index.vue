<script setup lang="ts">
import router from '@renderer/router'
import {useRoute} from 'vue-router'
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useProjectStore} from '@renderer/store/project'
import {useDateStore} from '@renderer/store/date'
import TitleBar from "@renderer/component/TitleBar.vue"
import {SunOne} from '@icon-park/vue-next'
import {useSettingsStore} from "@renderer/store/settings";
import {Theme} from "@icon-park/vue-next/es/runtime";
import SideList from "@renderer/views/LayoutView/SideList.vue";
import SideBottom from "@renderer/views/LayoutView/SideBottom.vue";

const route = useRoute()
const projectStore = useProjectStore()
const dateStore = useDateStore()
const settings = useSettingsStore()

const intervalRef = ref()

onMounted(() => {
  console.debug('interval update date')
  if (settings.autoUpdateDate) {
    console.debug('start auto update date')
    intervalRef.value = setInterval(() => {
      dateStore.update2Now()
    }, 30_000)
  }
})

onUnmounted(() => {
  if (intervalRef.value !== undefined) clearInterval(intervalRef.value)
})

const activeId = computed(() => {
  return (route.params.id ?? 'default') as string
})

const handleTodayClick = () => {
  router.push({
    name: 'today',
    replace: true
  })
}

const addButtonClick = () => {
  const projectId = projectStore.createByName('新任务列表')
  renaming.value = true
  router.push({
    path: `/project/${projectId}`
  })
}

const myDayStyle = computed<{ theme: Theme, color: string }>(() => {
  const active = activeId.value === 'default'
  return {
    theme: active ? 'filled' : 'outline',
    color: active ? '#f2b439' : '#333'
  }
})

const renaming = ref(false)

function handleRename() {
  renaming.value = false
}

</script>

<template>
  <div>
    <div class="main">
      <div class="side">
        <title-bar/>
        <div class="my-day">
          <div class="today-content" @click="handleTodayClick">
            <sun-one :theme="myDayStyle.theme" size="20"
                     :fill="myDayStyle.color" :strokeWidth="2"
                     style="margin:0 4px 0 8px;display: flex; justify-content: center; align-items: center "/>
            <div style="display: inline-block; margin:0 8px 0 4px" :style="{color:myDayStyle.color}">
              我的一天
            </div>
          </div>
        </div>
        <side-list :rename="renaming?handleRename:undefined"/>
        <side-bottom :on-add-click="addButtonClick"/>
      </div>
      <div class="content">
        <slot/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: hidden;
  background: var(--color-background);
  display: grid;
  width: var(--win-width);
  height: var(--win-height);
  grid-template-columns: var(--side-width) var(--content-width);
  border-radius: 8px;

  .side {
    display: grid;
    grid-template-rows: 24px 40px 1fr 40px;

    .my-day {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-app-region: drag;
      box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;

      .today-content {
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        height: 40px;
        width: max-content;
        -webkit-app-region: no-drag;
      }
    }
  }

  .content {
    width: 100%;
  }
}
</style>
