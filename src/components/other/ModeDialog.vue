<script setup lang="ts">

import { useEventListener } from '@vueuse/core'

const props = defineProps<{
  ok?: () => void,
  cancel?: () => void
}>()

useEventListener(document, 'keydown', (e) => {
  if (e.code === 'Escape') {
    props.cancel?.()
  }
})
</script>

<template>
  <teleport to="body">
    <div class="the-container">
      <div class="dialog">
        <main>
          <slot />
        </main>
        <footer>
          <div @click="ok">确定</div>
          <div @click="cancel">取消</div>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.the-container {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000030;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 7;

  .dialog {
    display: flex;
    width: 300px;
    height: 250px;
    flex-direction: column;
    border-radius: 8px;
    border: solid 1px #00000070;
    background-color: #fdfdfd;
  }
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  font-size: 16px;
  font-weight: lighter;
}

footer {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  border-top: solid #00000030 1px;
  height: 50px;

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    margin-right: 12px;
    padding: 4px;
    border: #00000040 solid 1px;
    border-radius: 4px;
    font-weight: lighter;
  }
}
</style>