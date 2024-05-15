<script setup lang="ts">
import { useCanvasContextMenu } from '@/stores/canvas-contextmenu'
import { computed, onMounted, ref } from 'vue'

const contextmenuRef = ref()
const contextmenu = useCanvasContextMenu()

const visible = computed(() => (contextmenu.visible ? 'flex' : 'none'))

const top = computed(() => contextmenu.clientY + 'px')

const width = computed(() => contextmenu.width + 'px')

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
  width: v-bind(width);
  background-color: rgb(59, 53, 47);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  border-radius: 8px;
  z-index: 3;

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
    margin: 8px;
    padding: 4px;
    width: 100%;
    border-radius: 4px;

    &:hover {
      background-color: #ffffff60;
    }
  }
}
</style>
