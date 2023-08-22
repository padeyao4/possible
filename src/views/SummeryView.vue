<template>
  <div>
    <div class="main">
      <div class="header" @wheel="handleWheel" id="header">
        <div class="time-item" v-for="time in times" :key="time" :style="{translate: relationX+'px'}">{{ time }}</div>
      </div>
      <div class="body">
        <el-drawer v-model="drawer" title="I am the title" :with-header="false">
          <span>Hi there!</span>
        </el-drawer>
        <div id="container" ref="container" class="container"></div>
      </div>
      <div class="footer">
        <p class="footer-label">{{ operationMode || 'null' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import store from "@/store";
import PossibleGraph from "@/g6/graph/possible-graph";
import type {Graph} from "@antv/g6";

const props = defineProps(['projectKey'])

const drawer = ref(false)
const times = ref<number[]>([...new Array(25).keys()].map(i => i - 1))
const container = ref<HTMLElement>()
const graph = ref<Graph>()

/**
 * time bar item align with canvas
 */
const relationX = computed(() => {
  return -(graph.value as Graph)?.getPointByCanvas?.(0, 0).x % 120 - 96
})

function moveRight(n = 1) {
  for (let i = 0; i < n; i++) {
    times.value.unshift(times.value[0] - 1)
    times.value.pop()
  }
}

function moveLeft(n = 1) {
  for (let i = 0; i < n; i++) {
    times.value.shift()
    times.value.push(times.value[times.value.length - 1] + 1)
  }
}

watch(() => -(graph.value as Graph)?.getPointByCanvas?.(0, 0).x, (newValue, oldValue) => {
      let n = Math.floor(Math.abs(newValue / 120))

      let headValue = times.value[0] + 1
      times.value[times.value.length - 1];
      let count = Math.abs(n - Math.abs(headValue))

      if (newValue - oldValue > 0) {
        moveRight(count)
      } else {
        moveLeft(count)
      }
    }
)

const handleWheel = (e: any) => {
  graph.value?.translate(e.deltaY / 5, 0)
}

const operationMode = computed(() => {
  return graph.value?.getCurrentMode()
})

onMounted(() => {
  // todo canvas on click not work

  // todo open drawer
  graph.value = new PossibleGraph(container.value, '').graph
  graph.value.read(store.dataByKey(props.projectKey));
})

onUnmounted(() => {
  graph.value?.destroy()
  console.log('graph destroy')
})

watch(props, () => {
  times.value = []
  for (let i = 0; i < 25; i++) {
    times.value.push(i - 1)
  }
  if (graph) {
    graph.value?.read(store.dataByKey(props.projectKey));
    // 更新画布背景
    graph.value?.emit('viewportchange')
  }
})

window.addEventListener("resize", () => {
  if (container.value) {
    graph.value?.changeSize(container.value.clientWidth, container.value.clientHeight - 8)
  }
})
</script>

<style scoped>
.main {
  background-color: #9f9f9f;
  overflow: hidden;
}

.header {
  position: sticky;
  top: 0;
  z-index: 99;
  -webkit-user-select: none;
  user-select: none;
  height: 60px;
  display: flex;
  align-items: center;
  overflow-x: hidden;

  .time-item {
    width: 100px;
    color: #c8c9cc;
    flex-shrink: 0;
    background-color: #1c1c1c;
    margin: 0 10px 0 10px;
  }
}


.body {
  padding: 0 20px;
  border: #222222 solid;
  overflow-y: auto;
  height: calc(100vh - 100px);
  background-color: rgb(158, 158, 158);

  .container {
    height: 100%;
    z-index: 1;
    position: relative;
    background-color: #fdfdfd;
  }
}

.footer {
  position: sticky;
  bottom: 0;
  height: 40px;
  background: whitesmoke;
  display: flex;
  justify-content: space-between;

  .footer-label {
    color: #181818;
    background-color: #c8c9cc;
    user-select: none;
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;

    &:hover {
      background: wheat;
    }
  }

  input[type='range'] {
    background-size: 50% 3px;
    margin: auto 0;
    width: 40%;
    background: linear-gradient(to right, #ccc 0%, #ccc 100%);
    outline: none;
    /*清除系统默认样式*/
    -webkit-appearance: none;
    appearance: none;
    /*横条的高度*/
    height: 3px;

    &::-webkit-slider-thumb {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: black;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      -webkit-appearance: none;
      border: 0;
    }
  }
}
</style>