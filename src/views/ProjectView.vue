<template>
  <div>
    <div class="main">
      <div class="header" @wheel="(e: any) => {graph?.translate(e.deltaY / 5,0)}" id="header">
        <div class="time-item" v-for="time in times" :key="time"
             :style="{translate:  translateX+'px'}">{{ time }}
        </div>
      </div>
      <div class="body">
        <task-drawer v-model:visible="visible" :task-id="activeTaskId"></task-drawer>
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
import {computed, onMounted, onUnmounted, watch} from 'vue';
import {Graph, type IEdge} from "@antv/g6";
import PossibleGrid from "@/g6/plugin/possible-grid";
import {type ITask, useGlobalStore} from "@/store/global";
import {v4 as uuidv4} from "uuid";
import TaskDrawer from "@/components/TaskDrawer.vue";
import {normalX, x2Index} from "@/util";

let visible = $ref<boolean>(false)
let activeTaskId = $ref<string>('')

let container = $ref<HTMLElement>()
let graph = $ref<Graph>()
const store = useGlobalStore()

watch([() => store.active, () => graph], () => {
  graph?.off('viewportchange', syncProjectOffset)
  graph?.read(store.graphData)
  let offset = store.currentProjectOffset
  let origin = graph?.getCanvasByPoint(0, 0)
  graph?.translate(offset.x - origin!.x, offset.y - origin!.y)
  graph?.on('viewportchange', syncProjectOffset)
})

const times = computed(() => {
  let x = graph?.getCanvasByPoint(0, 0).x ?? 0
  let n = Math.floor(Math.abs(x / 120)) * (x >= 0 ? 1 : -1)
  return [...new Array(25).keys()].map(i => i - n - 2)
})

const translateX = computed(() => {
  let x = graph?.getCanvasByPoint(0, 0).x ?? 0
  return x % 120 - 216
})

onMounted(() => {
  // todo canvas on click not work
  graph = new Graph({
    container: container!,
    width: container!.clientWidth,
    height: container!.clientHeight - 8,
    plugins: [new PossibleGrid()],
    modes: {
      default: [
        {
          type: 'drag-canvas',
          allowDragOnItem: false,
          enableOptimize: true,
          scalableRange: 99,
        }, 'possible-drag-node'],
      edit: [{
        type: 'create-edge',
        trigger: 'drag'
      },]
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
      style: {
        endArrow: true
      }
    }
  });

  // todo
  graph.on('node:dblclick', (e) => {
    if (graph?.getCurrentMode() === 'default') {
      console.log('on node')
    }
  })

  // create node by double click
  graph.on('dblclick', e => {
    if (e.target.isCanvas?.() && graph?.getCurrentMode() === 'default') {
      let newNode = {
        id: uuidv4(),
        label: 'untitled',
        x: normalX(e.x),
        y: e.y
      };
      graph?.addItem('node', newNode)
      store.currentProjectAddTask({
        id: newNode.id,
        name: newNode.label,
        dataIndex: x2Index(newNode.x),
        y: newNode.y
      } as ITask)
    }
  })
  graph.on('node:dragend', (e) => {
    let model = e.item!.getModel()
    store.setCurrentProjectTask({
      id: model.id!,
      dataIndex: x2Index(model.x!),
      y: model.y!
    } as ITask)

    // 清理空边
    let edges = e.item?._cfg?.edges as IEdge[]
    edges.filter(edge => edge._cfg?.targetNode === null).forEach(edge => {
      console.log(edge)
      graph?.removeItem(edge)
    })
  })
  graph.on('keydown', e => {
    if (e.key === 'Control') {
      graph?.setMode('edit')
    }
  })
  graph.on('keyup', e => {
    if (e.key === 'Control') {
      graph?.setMode('default')
    }
  })
  // 处理添加完边后的操作
  graph.on('aftercreateedge', (e) => {
    console.log('after create edge', e.edge);
    let edge = e.edge as IEdge

    // 删除自环边
    if (edge.getSource() === edge.getTarget()) {
      console.log('same source')
      graph?.removeItem(edge)
    }

    // todo 删除重复边

    // todo 边大小转换和排序

    // todo 存储边数据
  });
})

const syncProjectOffset = () => {
  let p = graph?.getCanvasByPoint(0, 0)
  if (p !== undefined) {
    store.setCurrentProjectOffset(p.x, p.y)
  }
}

onUnmounted(() => {
  graph?.destroy()
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