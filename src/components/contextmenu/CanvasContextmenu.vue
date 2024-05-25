<script setup lang="ts">
import { useCanvasContextMenu } from '@/stores/contextmenu'
import { computed, onMounted, ref } from 'vue'

const contextmenuRef = ref()
const contextmenu = useCanvasContextMenu()

const visible = computed(() => (contextmenu.visible ? 'flex' : 'none'))

const top = computed(() => contextmenu.clientY + 'px')

const left = computed(() => contextmenu.clientX + 'px')

onMounted(() => {
  contextmenu.setElement(contextmenuRef.value)
  contextmenuRef.value?.force?.()
})
</script>

<template>
  <teleport to="body">
    <div
      ref="contextmenuRef"
      class="contextmenu"
      @contextmenu.prevent
      @click="contextmenu.visible = false"
    >
      <div v-for="(value, key) in contextmenu.list" @click="value" :key="key">
        {{ key }}
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.contextmenu {
  position: fixed;
  display: v-bind(visible);
  flex-direction: column;
  left: v-bind(left);
  top: v-bind(top);
  width: 200px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgb(0, 0, 0);
  background-color: #262626;
  z-index: 3;
  animation: fadeIn 200ms ease-in;

  &::before {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    padding: 4px;
    border-radius: 4px;
    color: #ffffff90;
    &:hover {
      background-color: #ffffff60;
    }
  }
}

@keyframes fadeIn{
  0%{
    opacity: 0;
  }

  100%{
    opacity: 1;
  }
}
</style>
