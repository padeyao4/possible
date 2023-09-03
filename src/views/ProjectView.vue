<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, watch} from 'vue';
import {Graph, type IEdge, Menu} from "@antv/g6";
import PossibleGrid from "@/g6/plugin/possible-grid";
import {type ITask, useGlobalStore} from "@/store/global";
import {v4 as uuidv4} from "uuid";
import TaskDrawer from "@/components/TaskEditor.vue";
import ProjectNameBadge from "@/components/ProjectNameBadge.vue";
import {normalX, x2Index} from "@/util";
import type {INode} from "@antv/g6-core";
import {type Item} from "@antv/g6-core";
import {$ref} from "vue/macros";


let visible = $ref<boolean>(false)
let activeTaskId = $ref<string>('')

let container = $ref<HTMLElement>()
let graph = $ref<Graph>()
const store = useGlobalStore()

watch([() => store.active, () => graph], () => {
  if (graph) {
    graph.off('viewportchange', syncProjectOffset)
    graph.read(store.graphData)
    let offset = store.currentProjectOffset
    let origin = graph.getCanvasByPoint(0, 0)
    graph.translate(offset.x - origin.x, offset.y - origin.y)
    graph.on('viewportchange', syncProjectOffset)
  }
})

const times = computed(() => {
  let x = graph?.getCanvasByPoint(0, 0).x ?? 0
  let n = Math.floor(Math.abs(x / 120)) * (x >= 0 ? 1 : -1)
  return [...new Array(25).keys()].map(i => i - n - 1)
})

const translateX = computed(() => {
  let x = graph?.getCanvasByPoint(0, 0).x ?? 0
  return x % 120 - 240
})

const openNodeEditor = (id: string) => {
  activeTaskId = id
  visible = true
}

onMounted(() => {
  // todo canvas on click not work
  graph = new Graph({
    container: "container",
    plugins: [new PossibleGrid(), new Menu({
      offsetX: -262,
      offsetY: -62,
      getContent: () => "删除",
      handleMenuClick: (_: HTMLElement, item: Item) => {
        console.log('item', item)
        let id = item.getID()
        let itemType = item.getType();
        if (itemType === 'node') {
          store.deleteCurrentProjectTaskById(id)
        }
        if (itemType === 'edge') {
          let model = (item as IEdge).getModel();
          console.log('model', model)
          store.currentProjectDeleteEdge(model.source as string, model.target as string)
        }
        graph?.removeItem(item)
      }
    })],
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
        endArrow: true,
      }
    },
    edgeStateStyles: {
      hover: {
        stroke: 'rgba(154,154,154,0.38)',
        lineWidth: 2,
      }
    }
  });

  // todo not worker
  graph.on('canvas:click', () => {
    alert("canvas:click")
  })

  graph.on('edge:mouseover', (e) => {
    graph?.setItemState(e.item!, 'hover', true)
  })
  graph.on('edge:mouseout', (e) => {
    graph?.setItemState(e.item!, 'hover', false)
  })

  // open drawer editor
  graph.on('node:dblclick', e => {
    if (graph?.getCurrentMode() === 'default') {
      openNodeEditor(e.item!.getID())
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
      graph.addItem('node', newNode)
      store.currentProjectAddTask({
        id: newNode.id,
        name: newNode.label,
        dataIndex: x2Index(newNode.x),
        y: newNode.y,
        children: [],
        parents: []
      })
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

    let sourceNode = edge.getSource() as INode;
    let targetNode = edge.getTarget() as INode;

    // 删除自环边
    if (sourceNode === targetNode) {
      nextTick(() => {
        graph?.removeItem(edge)
      })
      return
    }

    // 删除重复边
    let count = sourceNode.getEdges()
        .filter(e => e.getTarget().getID() === targetNode.getID() || e.getSource().getID() === targetNode.getID()).length
    if (count >= 2) {
      nextTick(() => {
        graph?.removeItem(edge)
      })
      return;
    }

    // 删除相同列的边
    if (sourceNode.getModel().x! >= targetNode.getModel().x!) {
      nextTick(() => {
        graph?.removeItem(edge)
      })
      return;
    }

    // 存储边数据
    store.currentProjectAddEdge(edge)
  });
})

const syncProjectOffset = () => {
  let p = graph?.getCanvasByPoint(0, 0)
  store.setCurrentProjectOffset(p)
}

onUnmounted(() => {
  graph?.destroy()
})

const dayOriginIndex = computed(() => {
  return Math.floor(new Date('2023/9/1').valueOf() / 86400000)
})

const todayIndex = computed(() => {
  return Math.floor(new Date().valueOf() / 86400000)
})

const timeIndex = computed(() => {
  return todayIndex.value - dayOriginIndex.value
})

/**
 * 回到今天时间点
 */
const back2Today = () => {
  let ox = graph?.getCanvasByPoint(0, 0).x ?? 0
  let dx = (timeIndex.value - 1) * 120 + ox
  graph?.translate(-dx, 0)
}

window.addEventListener("resize", () => {
  if (container) {
    graph?.changeSize(container.clientWidth, container.clientHeight)
  }
})
</script>

<template>
  <div>
    <div class="main">
      <div class="header" @wheel="(e: any) => {graph?.translate(e.deltaY / 5,0)}" id="header">
        <div class="time-item" v-for="time in times" :key="time"
             :style="{translate:  translateX+'px',}"
             :class="{active:  time===timeIndex}">{{
            new Intl.DateTimeFormat("zh-Hans").format(new Date((time + 19600) * 86400000))
          }}
        </div>
      </div>
      <div class="body">
        <task-drawer v-model:visible="visible" :graph="graph!" :task-id="activeTaskId"></task-drawer>
        <div id="container" ref="container" class="container"></div>
      </div>
      <div class="footer">
        <ProjectNameBadge/>
        <p class="footer-label">{{ graph?.getCurrentMode() }}</p>
        <el-button @click="back2Today">today</el-button>
        <p class="footer-label">{{ graph?.getCanvasByPoint(0, 0) }}</p>
      </div>
    </div>
  </div>
</template>


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

  .active {
    color: greenyellow;
  }
}

.body {
  overflow: hidden;
  height: calc(100vh - 100px);
  background-color: rgb(158, 158, 158);

  .container {
    display: inline-block;
    height: 100%;
    width: 100%;
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
  align-items: center;
  border-top: 1px solid;

  .footer-label {
    color: #181818;
    background-color: #c8c9cc;
    user-select: none;
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
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
}
</style>