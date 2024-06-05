<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

const props = defineProps<{
  ok?: () => void
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
          <slot></slot>
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
  top: 0;
  left: 0;
  z-index: 7;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #00000030;

  .dialog {
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 250px;
    background-color: #fdfdfd;
    border: solid 1px #00000030;
    border-radius: 8px;
    box-shadow:
      0 0 10px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(247, 247, 249, 0.25);
  }
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  overflow: hidden;
  font-weight: lighter;
  font-size: 16px;
}

footer {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  height: 50px;
  border-top: solid #00000030 1px;

  & > * {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    margin-right: 12px;
    padding: 4px;
    font-weight: lighter;
    border: #00000040 solid 1px;
    border-radius: 4px;
  }
}
</style>
