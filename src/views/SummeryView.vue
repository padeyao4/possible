<template>
  <div>
    <div class="main">
      <div class="header" @wheel="(e: any) => {graph?.translate(e.deltaY / 5,0)}" id="header">
        <div class="time-item" v-for="time in times" :key="time"
             :style="{translate:  translateX+'px'}">{{ time }}
        </div>
      </div>
      <div class="body">
        <el-drawer v-model="drawer" title="I am the title" :with-header="false">
          <span>Hi there!</span>
        </el-drawer>
        <div id="container" ref="container" class="container"></div>
      </div>
      <div class="footer">
        <p class="footer-label">{{ graph?.getCurrentMode() }}</p>
        <p class="footer-label">{{ store.currentProjectOffset }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {Graph} from "@antv/g6";
import PossibleGrid from "@/g6/plugin/possible-grid";
import {useGlobalStore} from "@/store/global";

const drawer = ref(false)
let container = $ref<HTMLElement>()
let graph = $ref<Graph>()
const store = useGlobalStore()

watch(() => store.active, () => {
  if (graph === undefined) return
  graph.read(store.graphData)
  // update grid
  graph?.emit('viewportchange')
  let offset = store.currentProjectOffset
  let origin = graph.getCanvasByPoint(0, 0)
  graph.translate(offset.x - origin.x, offset.y - origin.y)
})

const times = computed(() => {
  let x = store.currentProjectOffset.x
  let n = Math.floor(Math.abs(x / 120)) * (x >= 0 ? 1 : -1)
  return [...new Array(25).keys()].map(i => i - n - 1)
})

const translateX = computed(() => {
  let x = store.currentProjectOffset.x
  return x % 120 - 96
})

watch(() => graph?.getCanvasByPoint(0, 0), (newValue) => {
  if (newValue) {
    store.setCurrentProjectOffset(newValue.x, newValue.y)
  }
})

onMounted(() => {
  // todo canvas on click not work

  // todo open drawer
  graph = new Graph({
    container: container!,
    width: container!.clientWidth,
    height: container!.clientHeight - 8,
    plugins: [new PossibleGrid()],
    modes: {
      default: [
        {
          type: 'drag-canvas',
          allowDragOnItem: true,
          enableOptimize: true,
          scalableRange: 99,
        },
        'double-click', 'ctrl-change-edit-mode'],
      edit: ['ctrl-change-edit-mode', 'possible-drag-node']
    },
    defaultNode: {
      type: 'rect',
      size: [100, 40],
      style: {
        fill: '#91d2fb',
        lineWidth: 1,
      },
    },
    defaultEdge: {
      type: 'cubic-horizontal',
    },
    // layout: {
    //     type: 'possible-layout'
    // }
  });
  graph.read(store.graphData)
})

onUnmounted(() => {
  graph?.destroy()
  console.log('graph destroy')
})

window.addEventListener("resize", () => {
  if (container) {
    graph?.changeSize(container.clientWidth, container.clientHeight - 8)
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