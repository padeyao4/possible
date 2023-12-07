<script setup lang="ts">
import router from '@renderer/router'
import {onMounted, onUnmounted, ref} from 'vue'
import {useStore} from '@renderer/store/project'
import {useDateStore} from '@renderer/store/date'
import TitleBar from "@renderer/component/TitleBar.vue"
import {useSettingsStore} from "@renderer/store/settings";
import SideList from "@renderer/views/LayoutView/component/SideList.vue";
import SideBottom from "@renderer/views/LayoutView/component/SideBottom.vue";
import SummeryButton from "@renderer/views/LayoutView/component/SummeryButton.vue";

const projectStore = useStore()
const dateStore = useDateStore()
const settings = useSettingsStore()

const intervalRef = ref()

onMounted(() => {
  if (settings.autoUpdateDate) {
    intervalRef.value = setInterval(() => {
      dateStore.update2Now()
    }, 30_000)
  }
})

onUnmounted(() => {
  if (intervalRef.value !== undefined) clearInterval(intervalRef.value)
})

const addButtonClick = () => {
  const projectId = projectStore.createByName('新任务列表')
  renaming.value = true
  router.push({
    path: `/project/${projectId}`
  })
}

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
        <summery-button/>
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
  }

  .content {
    width: 100%;
  }
}
</style>
