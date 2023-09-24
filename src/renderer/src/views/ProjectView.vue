<script setup lang="ts">
import { Graph, type IEdge, Menu } from '@antv/g6'
import type { INode } from '@antv/g6-core'
import { type Item } from '@antv/g6-core'
import TaskDrawer from '@renderer/components/TaskEditor.vue'
import { v4 as uuidv4 } from 'uuid'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import PossibleGrid from '@renderer/g6/plugin/possible-grid'
import { type ITask, useGlobalStore } from '@renderer/store/global'
import { normalX, x2Index } from '@renderer/util'
import router from '@renderer/router'
import { Delete, Promotion, SetUp } from '@element-plus/icons-vue'

const visible = ref<boolean>(false)
const activeTaskId = ref<string>('')

const container = ref<HTMLElement>()
const store = useGlobalStore()
const graphMode = ref<string>()

let graph: Graph | null = null
const graphRef = ref()

const offset = computed(() => {
  return store.currentProject?.offset ?? { x: 0, y: 0 }
})

watch([() => store.active, () => graphRef.value], () => {
  const setOriginPoint = () => {
    const { x, y } = graph?.getCanvasByPoint(0, 0) ?? { x: 0, y: 0 }
    store.setCurrentProjectOffset({ x, y })
  }
  graph?.off('viewportchange', setOriginPoint)
  graph?.read(store.graphData)
  const { x: ox, y: oy } = graph?.getCanvasByPoint(0, 0) ?? { x: 0, y: 0 }
  const { x: sx, y: sy } = offset.value
  const dx = sx - ox
  const dy = sy - oy
  graph?.translate(dx, dy)
  graph?.on('viewportchange', setOriginPoint)
})

const timeItems = computed(() => {
  const x = offset.value.x
  const n = Math.floor(Math.abs(x / 120)) * (x >= 0 ? 1 : -1)
  return [...new Array(25).keys()].map((i) => i - n - 1)
})

const translateX = computed(() => {
  return (offset.value.x % 120) - 240
})

const openNodeEditor = (id: string) => {
  activeTaskId.value = id
  visible.value = true
}

onMounted(() => {
  graph = new Graph({
    container: 'container',
    plugins: [
      new PossibleGrid(),
      new Menu({
        offsetX: -240,
        offsetY: -60,
        getContent: () => '删除',
        handleMenuClick: (_: HTMLElement, item: Item) => {
          const id = item.getID()
          const itemType = item.getType()
          if (itemType === 'node') {
            store.deleteCurrentProjectTaskById(id)
          }
          if (itemType === 'edge') {
            const model = (item as IEdge).getModel()
            store.currentProjectDeleteEdge(model.source as string, model.target as string)
          }
          graph?.removeItem(item)
        }
      })
    ],
    modes: {
      default: [
        {
          type: 'drag-canvas',
          allowDragOnItem: false,
          enableOptimize: true,
          scalableRange: 99
        },
        'possible-drag-node'
      ],
      edit: [
        {
          type: 'create-edge',
          trigger: 'drag'
        }
      ]
    },
    defaultNode: {
      type: 'rect',
      size: [100, 40],
      style: {
        fill: '#91d2fb',
        lineWidth: 1
      }
    },
    defaultEdge: {
      type: 'cubic-horizontal',
      style: {
        endArrow: true
      }
    },
    edgeStateStyles: {
      hover: {
        stroke: 'rgba(154,154,154,0.38)',
        lineWidth: 2
      }
    }
  })

  graph.on('edge:mouseover', (e) => {
    graph?.setItemState(e.item as Item, 'hover', true)
  })
  graph.on('edge:mouseout', (e) => {
    graph?.setItemState(e.item as Item, 'hover', false)
  })

  // open drawer editor
  graph.on('node:dblclick', (e) => {
    if (graph?.getCurrentMode() === 'default') {
      openNodeEditor((e.item as Item).getID())
    }
  })

  graph.on('canvas:dblclick', (e) => {
    const newNode = {
      id: uuidv4(),
      label: 'untitled',
      x: normalX(e.x),
      y: e.y
    }
    graph?.addItem('node', newNode)
    store.currentProjectAddTask({
      id: newNode.id,
      name: newNode.label,
      dataIndex: x2Index(newNode.x),
      y: newNode.y,
      children: [],
      parents: []
    })
  })

  graph.on('node:dragend', (e) => {
    const model = (e.item as Item).getModel()
    store.setCurrentProjectTask({
      id: model.id,
      dataIndex: x2Index(model.x as number),
      y: model.y
    } as ITask)
  })
  graph.on('keydown', (e) => {
    if (e.key === 'Control') {
      graph?.setMode('edit')
    }
  })
  graph.on('keyup', (e) => {
    if (e.key === 'Control') {
      graph?.setMode('default')
    }
  })
  // 处理添加完边后的操作
  graph.on('aftercreateedge', (e) => {
    console.log('after create edge', e.edge)
    const edge = e.edge as IEdge

    const sourceNode = edge.getSource() as INode
    const targetNode = edge.getTarget() as INode

    // 删除自环边
    if (sourceNode === targetNode) {
      nextTick(() => {
        graph?.removeItem(edge)
      })
      return
    }

    // 删除重复边
    const count = sourceNode
      .getEdges()
      .filter(
        (e) =>
          e.getTarget().getID() === targetNode.getID() ||
          e.getSource().getID() === targetNode.getID()
      ).length
    if (count >= 2) {
      nextTick(() => {
        graph?.removeItem(edge)
      })
      return
    }

    // 删除相同列的边
    if ((sourceNode.getModel().x as number) >= (targetNode.getModel().x as number)) {
      nextTick(() => {
        graph?.removeItem(edge)
      })
      return
    }

    // 存储边数据
    store.currentProjectAddEdge(edge)
  })

  graph.on('aftermodechange', (e) => {
    graphMode.value = e.mode as string
  })

  graphRef.value = graph

  window.addEventListener('resize', () => {
    if (container.value) {
      graph?.changeSize(container.value.clientWidth, container.value.clientHeight)
    }
  })
})

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
  const ox = offset.value.x
  const dx = (timeIndex.value - 1) * 120 + ox
  graph?.translate(-dx, 0)
}

const titleEditEnable = ref<boolean>(false)
const titleRef = ref()

const editTitle = () => {
  titleEditEnable.value = true
  nextTick(() => {
    titleRef.value.focus()
  })
}

const submitTitle = () => {
  titleEditEnable.value = false
}

const deleteDialogVisible = ref(false)

const handleDelete = () => {
  router.push({ name: 'home' })
  delete store.projects[store.active]
  store.active = 'today'
}
</script>
<template>
  <div>
    <div class="main">
      <div class="header">
        <div class="title">
          <div v-if="titleEditEnable">
            <input
              ref="titleRef"
              v-model="store.currentProject.name"
              class="title-input"
              @blur="submitTitle"
              @keydown.enter="submitTitle"
            />
          </div>
          <div v-else style="padding-left: 1px" @dblclick="editTitle">
            {{ store.currentProject?.name ?? '' }}
          </div>
          <div>
            <el-dropdown trigger="click">
              <el-button size="small">
                <el-icon>
                  <MoreFilled />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Delete" @click="deleteDialogVisible = true"
                    >删除
                  </el-dropdown-item>
                  <el-dropdown-item :icon="SetUp" @click="editTitle">重命名</el-dropdown-item>
                  <el-dropdown-item :icon="Promotion">导出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dialog v-model="deleteDialogVisible" title="警告" width="30%" align-center>
              <span
                >确定删除
                <i style="font-size: large">{{ store.currentProject?.name ?? '' }} </i> 计划吗</span
              >
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="deleteDialogVisible = false">取消</el-button>
                  <el-button @click="handleDelete"> 确定 </el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </div>
      </div>

      <div class="body">
        <task-drawer
          v-model:visible="visible"
          :graph="graphRef"
          :task-id="activeTaskId"
        ></task-drawer>

        <div
          class="time-bar"
          @wheel="
            (e: any) => {
              graph?.translate(e.deltaY / 5, 0)
            }
          "
        >
          <div
            v-for="timeItem in timeItems"
            :key="timeItem"
            class="time-item"
            :style="{ translate: translateX + 'px' }"
            :class="{ active: timeItem === timeIndex }"
          >
            {{ new Intl.DateTimeFormat('zh-Hans').format(new Date((timeItem + 19600) * 86400000)) }}
          </div>
        </div>
        <div id="container" ref="container" class="container"></div>
      </div>
      <div class="footer">
        <el-button @click="back2Today">today</el-button>
        <p class="footer-label">{{ graphMode }}</p>
        <p class="footer-label">{{ offset }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: hidden;

  .header {
    .title {
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      font-size: 24px;
      user-select: none;

      .title-input {
        outline-style: none;
        border: 1px solid #ccc;
        box-sizing: content-box;
        /* border-radius: 3px; */
        font-size: 24px;
      }
    }
  }

  .body {
    overflow: hidden;
    height: calc(100vh - 104px);
    padding: 24px 24px 16px 24px;

    .time-bar {
      z-index: 99;
      user-select: none;
      height: 32px;
      display: flex;
      align-items: center;
      overflow-x: hidden;

      .time-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        color: #727272;
        flex-shrink: 0;
        /* background-color: #1c1c1c; */
        margin: 0 10px 0 10px;
        border: 1px #c8c9cc;
      }

      .active {
        color: greenyellow;
      }
    }

    .container {
      display: inline-block;
      height: 100%;
      width: 100%;
      z-index: 1;
      position: relative;
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
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
