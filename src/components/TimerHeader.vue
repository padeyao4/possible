<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch, watchEffect } from 'vue'
import { Canvas, Group, Text } from '@antv/g'
import { Renderer } from '@antv/g-canvas'
import { useStore } from '@/stores/store'
import { convertToDate, convertToIndex, showWeek } from '@/utils/time.js'
import { useRoute } from 'vue-router'

const store = useStore()
const container = ref()
const canvas = shallowRef()
const group = shallowRef()
const route = useRoute()

const currentProject = store.projects[route.params.id as string]

const timeFormat = new Intl.DateTimeFormat('zh-Hans')

const currentIndex = computed(() => convertToIndex(store.currentTime))

const startIndex = computed(() => convertToIndex(store.projects[route.params.id as string].createTime))

function showTime(index: number | string) {
  const date = convertToDate(index)
  return timeFormat.format(date) + '\n' + showWeek(date)
}

watch([group, currentIndex], () => {
  updateInfo()
})

function updateInfo() {
  if (!currentProject.data.graph) return
  const { x } = currentProject.data.graph.getCanvasByViewport({ x: 0, y: 0 })
  group.value.setPosition(-x % 120, 0)
  const children = group.value.getChildren()
  const offset = x / 120
  const delta = offset >= 0 ? Math.floor(offset) : Math.ceil(offset)
  for (let i = 0; i < children.length; i++) {
    const index = +children[i].id + delta
    children[i].style.text = showTime(index)
    children[i].style.fill = index === currentIndex.value ? 'green' : 'black'
  }
}

function resize() {
  canvas.value.resize(container.value.clientWidth, container.value.clientHeight)
  initTexts()
}

function initTexts() {
  group.value.removeChildren()
  const childrenSize = Math.ceil(container.value.clientWidth / 120) + 1
  for (let i = -1; i < childrenSize; i++) {
    const text = new Text({
      id: (i + startIndex.value).toString(),
      style: {
        x: i * 120 + 60,
        y: 20,
        text: '',
        fontSize: 14,
        fill: '#000000',
        textBaseline: 'middle',
        textAlign: 'center',
        wordWrapWidth: 100,
        wordWrap: true,
        lineWidth: 5
      }
    })
    group.value.appendChild(text)
  }
  updateInfo()
}

onMounted(() => {
    canvas.value = new Canvas({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      renderer: new Renderer()
    })

    group.value = new Group()
    canvas.value.appendChild(group.value)
    initTexts()

    watchEffect(() => {
      currentProject.data.graph?.on('viewportchange', updateInfo)
    })

    window.addEventListener('resize', resize)
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div>
    <div id="container" ref="container"></div>
  </div>
</template>

<style scoped>
#container {
  height: 40px;
  width: calc(100vw - 240px - 24px * 2);
}
</style>