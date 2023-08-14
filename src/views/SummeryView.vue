<template>
  <div>
    <div class="main">
      <div class="header" @wheel="handleWheel" ref="header" id="header">
        <div class="time-item" v-for="time in times" :key="time" :style="{translate: relationX+'px'}">{{ time }}</div>
      </div>
      <div class="body">
        <div id="container" ref="container" class="container"></div>
      </div>
      <div class="footer">
      </div>
    </div>
  </div>
</template>

<script setup>
import G6, {Grid} from '@antv/g6';
import {computed, onMounted, ref, watch} from 'vue';
import store from "@/store";

const props = defineProps(['projectKey'])

const header = ref(null)
const times = ref([])

const translateX = ref(0)

const relationX = computed(() => {
  return translateX.value % 120 - 96
})

const timeCols = 25;

function initTimesArr() {
  for (let i = 0; i < timeCols; i++) {
    times.value.push(i - 1)
  }
}

initTimesArr()

function moveRight(n = 1) {
  for (let i = 0; i < n; i++) {
    times.value.unshift(times.value[0] - 1)
    times.value.pop()
  }
}

function moveLeft(n = 1) {
  for (let i = 0; i < n; i++) {
    times.value.shift()
    times.value.push(times.value.at(-1) + 1)
  }
}


watch(translateX, (newValue, oldValue) => {
      let n = Math.floor(Math.abs(newValue / 120))

      let headValue = times.value[0] + 1
      times.value.at(-1);
      let count = Math.abs(n - Math.abs(headValue))

      if (newValue - oldValue > 0) {
        moveRight(count)
      } else {
        moveLeft(count)
      }
    }
)

const handleWheel = (e) => {
  let dx = e.deltaY / 5;
  translateX.value = (translateX.value + dx)
  graph.value.translate(dx, 0)
}

const container = ref(null)
const graph = ref(null)


onMounted(() => {
  let grid = new Grid();

  // todo canvas on click not work
  G6.registerBehavior('double-click-canvas-add-node', {
    getEvents() {
      return {
        'dblclick': 'onCreateNode'
      }
    },
    onCreateNode(e) {
      if (e.target?.isCanvas?.()) {
        this.graph.addItem("node", {
          x: e.x,
          y: e.y,
          id: `node-${e.x}-${e.y}`
        })
      }
    }
  })
  graph.value = new G6.Graph({
    container: container.value,
    width: container.value.clientWidth,
    height: container.value.clientHeight - 8,
    plugins: [grid],
    modes: {
      default: [{
        type: 'drag-canvas',
        allowDragOnItem: true,
        enableOptimize: true,
        scalableRange: 99,
        shouldUpdate: () => {
          let p = graph.value.getPointByCanvas(0, 0)
          // 将画布长度和滚动条绑定
          translateX.value = -p.x
          return true
        },
      }, {
        type: 'double-click-canvas-add-node'
      }, {
        // todo 拖动需要指定范围，前端不能操作父节点，后端不能操作子节点
        // todo 指定编辑模式可拖动
        type: 'drag-node'
      }],
    },
    defaultNode: {
      type: 'rect',
      size: [100, 40],
      style: {
        fill: '#91d2fb',
        lineWidth: 0,
      },
    },
    defaultEdge: {
      type: 'cubic-horizontal',
      style: {}
    }
  });

  graph.value.data(store.dataByKey(props.projectKey));
  graph.value.render();
})

watch(props, () => {
  console.log('watch render g6', props.projectKey)
  graph.value.data(store.dataByKey(props.projectKey));
  graph.value.render();
})

window.addEventListener("resize", () => {
  if (container.value) {
    graph.value.changeSize(container.value.clientWidth, container.value.clientHeight - 8)
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

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  //padding: auto 5px; -webkit-user-select: none; user-select: none; min-width: 40px; min-height: 30px; border-radius: 10%;

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