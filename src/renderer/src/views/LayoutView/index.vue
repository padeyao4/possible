<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue'
import TitleBar from "@renderer/component/TitleBar.vue"
import SideList from "@renderer/views/LayoutView/component/SideList.vue";
import SideBottom from "@renderer/views/LayoutView/component/SideBottom.vue";
import SummeryButton from "@renderer/views/LayoutView/component/SummeryButton.vue";
import {useStore} from "@renderer/store/project";
import {originIndex} from "@renderer/util/time";

const store = useStore()
const intervalRef = ref()

onMounted(() => {
  if (store.autoUpdateDate) {
    intervalRef.value = setInterval((() => {
      store.dn = originIndex(new Date())
      return () => {
        store.dn = originIndex(new Date())
      }
    })(), 10_000)
  }
  watch(() => store.dn, () => {
    store.update()
  })
})

onUnmounted(() => {
  if (intervalRef.value) clearInterval(intervalRef.value)
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
  width: 100vw;
  height: 100vh;
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
