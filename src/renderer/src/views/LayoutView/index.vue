<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {useDateStore} from '@renderer/store/date'
import TitleBar from "@renderer/component/TitleBar.vue"
import SideList from "@renderer/views/LayoutView/component/SideList.vue";
import SideBottom from "@renderer/views/LayoutView/component/SideBottom.vue";
import SummeryButton from "@renderer/views/LayoutView/component/SummeryButton.vue";
import {useSettings} from "@renderer/store/project";

const dateStore = useDateStore()
const settings = useSettings()

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

</script>

<template>
  <div>
    <div class="layout-main">
      <div class="layout-side">
        <title-bar/>
        <summery-button/>
        <side-list/>
        <side-bottom/>
      </div>
      <div class="layout-content">
        <slot/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-main {
  overflow: hidden;
  background: var(--color-background);
  display: grid;
  width: var(--win-width);
  height: var(--win-height);
  grid-template-columns: var(--side-width) var(--content-width);
  border-radius: 8px;
  border: solid 1px #58585860;

  .layout-side {
    display: grid;
    grid-template-rows: 24px 40px 1fr 40px;
  }

  .layout-content {
    width: 100%;
  }
}
</style>
