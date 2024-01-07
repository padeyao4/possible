<script setup lang="ts">
import { Local } from '@icon-park/vue-next'
import Tip from '@renderer/component/Tip.vue'
import { useStore } from '@renderer/store'
import { index2Date } from '@renderer/util/time'

const props = defineProps<{
  callback: Function
}>()

const store = useStore()

const today = () => {
  props.callback?.(index2Date(store.dn))
}
</script>

<template>
  <tip content="返回今天">
    <local
      theme="outline"
      size="20"
      fill="#333"
      :stroke-width="2"
      class="today-button"
      @click="today"
    />
  </tip>
</template>

<style scoped>
.today-button {
  padding: 4px;
  margin: 0 4px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(37, 159, 167, 0.1);
    border-radius: 4px;
  }
}
</style>
