<script setup lang="ts">
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from '@icon-park/vue-next'
import { IGraph } from '@antv/g6'
import { ref } from 'vue'

const props = defineProps<{
  graph: IGraph | undefined
}>()

const stepSize = 10

const direction = {
  left: { dx: stepSize, dy: 0 },
  right: { dx: -stepSize, dy: 0 },
  up: { dx: 0, dy: stepSize },
  down: { dx: 0, dy: -stepSize }
}

const interval = ref()

function move(key: string) {
  clearInterval(interval.value)
  interval.value = setInterval(() => {
    const { dx, dy } = direction[key]
    props.graph?.translate(dx, dy)
  }, 10)
}

function cancelInterval() {
  clearInterval(interval.value)
}
</script>

<template>
  <div class="arrow-icon">
    <arrow-left
      theme="outline"
      size="20"
      fill="#333"
      :stroke-width="2"
      @mousedown="move('left')"
      @mouseup="cancelInterval"
    />
    <arrow-right
      theme="outline"
      size="20"
      fill="#333"
      :stroke-width="2"
      @mousedown="move('right')"
      @mouseup="cancelInterval"
    />
    <arrow-up
      theme="outline"
      size="20"
      fill="#333"
      :stroke-width="2"
      @mousedown="move('up')"
      @mouseup="cancelInterval"
    />
    <arrow-down
      theme="outline"
      size="20"
      fill="#333"
      :stroke-width="2"
      @mousedown="move('down')"
      @mouseup="cancelInterval"
    />
  </div>
</template>

<style scoped>
.arrow-icon {
  display: flex;
  flex-direction: row;

  & > * {
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
}
</style>
