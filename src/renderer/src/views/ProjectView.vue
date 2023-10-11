<script setup lang="ts">
import { Graph, type IEdge, Menu } from '@antv/g6'
import type { EdgeConfig, IG6GraphEvent, INode, NodeConfig } from '@antv/g6-core'
import { type Item } from '@antv/g6-core'
import { v4 as uuidv4 } from 'uuid'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import PossibleGrid from '@renderer/g6/plugin/possible-grid'
import { date2Day, index2Date, normalX, x2Index } from '@renderer/util'
import { Delete, Promotion, SetUp } from '@element-plus/icons-vue'
import { useProjectStore } from '@renderer/store/project'
import router from '@renderer/router'
import { IRelation, ITask } from '@renderer/store'
import { debounce } from '@antv/util'

const props = defineProps<{
  id: string
}>()
const projectStore = useProjectStore()

const container = ref<HTMLElement>()

let graph: Graph | null = null
const graphRef = ref<Graph | null>()

const projectTitle = computed<string>({
  get() {
    return projectStore.get(props.id).name
  },
  set(name) {
    projectStore.update(props.id, { name })
  }
})

const offset = computed(() => {
  return projectStore.get(props.id).offset ?? { x: 0, y: 0 }
})

const viewportChange = () => {
  const { x, y } = graph?.getCanvasByPoint(0, 0) ?? { x: 0, y: 0 }
  projectStore.update(props.id, { offset: { x, y } })
}

const afterRemoveItem = (e: IG6GraphEvent) => {
  if (e.type === 'node') {
    projectStore.deleteTask(props.id, (e.item as unknown as NodeConfig).id)
  }
  if (e.type === 'edge') {
    projectStore.deleteRelation(props.id, (e.item as unknown as EdgeConfig).id as string)
  }
}

const afterAddItem = (e: IG6GraphEvent) => {
  console.log('add item', e.item?.getModel())
  if (e.item?.getType() === 'node') {
    projectStore.addTask(props.id, e.item.getModel() as unknown as ITask)
  }
  if (e.item?.getType() === 'edge') {
    projectStore.addRelation(props.id, e.item.getModel() as unknown as IRelation)
  }
}

/**
 * 更新节点防抖
 */
const debounceAfterUpdateItem = debounce(function (e: IG6GraphEvent) {
  console.log('debounce update ', e, e.item?.getModel())
  if (e.item?.getType() === 'node') {
    projectStore.updateTask(props.id, e.item.getModel() as unknown as ITask)
  }
  if (e.item?.getType() === 'edge') {
    projectStore.updateRelation(props.id, e.item.getModel() as unknown as IRelation)
  }
}, 500)

watch([props, graphRef], () => {
  graph?.off('viewportchange', viewportChange)
  graph?.off('afterremoveitem', afterRemoveItem)
  graph?.off('afteradditem', afterAddItem)
  graph?.off('afterupdateitem', debounceAfterUpdateItem)
  graph?.read(projectStore.data(props.id))
  const { x: ox, y: oy } = graph?.getCanvasByPoint(0, 0) ?? { x: 0, y: 0 }
  const { x: sx, y: sy } = offset.value
  graph?.translate(sx - ox, sy - oy)
  graph?.on('viewportchange', viewportChange)
  graph?.on('afterremoveitem', afterRemoveItem)
  graph?.on('afteradditem', afterAddItem)
  graph?.on('afterupdateitem', debounceAfterUpdateItem)
})

const timeItems = computed(() => {
  const x = offset.value.x
  const n = Math.floor(Math.abs(x / 120)) * (x >= 0 ? 1 : -1)
  return [...new Array(25).keys()].map((i) => i - n - 1)
})

const translateX = computed(() => {
  return (offset.value.x % 120) - 240
})

onMounted(() => {
  graph = new Graph({
    container: 'container',
    plugins: [
      new PossibleGrid(),
      new Menu({
        offsetX: -(container.value?.offsetLeft ?? 0),
        offsetY: -(container.value?.offsetTop ?? 0),
        getContent: () => '删除',
        handleMenuClick: (_: HTMLElement, item: Item) => {
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
      type: 'task-node'
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
      editorTaskId.value = (e.item as Item).getID()
      editorVisible.value = true
    }
  })

  graph.on('canvas:dblclick', (e) => {
    const nx = normalX(e.x)
    const newTaskModel = {
      completedTime: undefined,
      createdTime: new Date(),
      id: uuidv4(),
      name: 'untitled',
      dataIndex: x2Index(nx),
      x: normalX(nx),
      y: e.y,
      state: 'normal',
      detail: '',
      note: '',
      target: ''
    }
    graph?.addItem('node', newTaskModel)
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

// ------------------------ project title ---------------------------
const titleEditEnable = ref<boolean>(false)
const titleRef = ref()

const editTitle = () => {
  titleEditEnable.value = true
  nextTick(() => {
    titleRef.value.focus()
  })
}

/**
 * 调用electron导出项目数据
 */
const exportProject = () => {
  const project = projectStore.get(props.id)
  window.api.exportProject(JSON.parse(JSON.stringify(project)))
}

const submitTitle = () => {
  titleEditEnable.value = false
}

const deleteDialogVisible = ref(false)

const handleDelete = () => {
  router.push({ name: 'today' })
  projectStore.delete(props.id)
}

// -------------------- editor --------------------
const editorTaskId = ref('')
const editorVisible = ref(false)

const editorOnClose = () => {
  editorVisible.value = false
}

const editorTaskModel = computed(() => {
  const task = graphRef.value?.findById(editorTaskId.value)?.getModel?.() as unknown as ITask
  return new Proxy(task, {
    get: (target, p) => {
      return Reflect.get(target, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target, p, newValue)
      graphRef.value?.updateItem(target.id, target as unknown as NodeConfig)
      return true
    }
  })
})

const handleNodeTest = () => {
  const nodes = graphRef.value?.getNodes()
  console.info('nodes', nodes)
}

const handleEdgeTest = () => {
  const edges = graphRef.value?.getEdges()
  console.info('edges', edges)
}
</script>

<template>
  <div>
    <div class="main">
      <div class="header">
        <div>
          <input
            v-if="titleEditEnable"
            ref="titleRef"
            v-model="projectTitle"
            class="title-input"
            @blur="submitTitle"
            @keydown.enter="submitTitle"
          />
          <div v-else class="title" @dblclick="editTitle">
            {{ projectTitle ?? '' }}
          </div>
        </div>
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
              <el-dropdown-item :icon="Promotion" @click="exportProject">导出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <Teleport to="body">
          <el-dialog v-model="deleteDialogVisible" title="警告" width="30%" align-center>
            <span
              >确定删除 <i style="font-size: large">{{ projectTitle ?? '' }} </i> 计划吗</span
            >
            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="deleteDialogVisible = false">取消</el-button>
                <el-button @click="handleDelete"> 确定 </el-button>
              </span>
            </template>
          </el-dialog>
        </Teleport>
      </div>

      <div class="body">
        <Teleport to="body">
          <el-drawer
            v-model="editorVisible"
            :close-on-click-modal="false"
            :show-close="true"
            @close="editorOnClose"
          >
            <el-form :model="editorTaskModel">
              <el-form-item label="名称">
                <el-input v-model="editorTaskModel.name" />
              </el-form-item>
              <el-form-item label="目标">
                <el-input v-model="editorTaskModel.target" />
              </el-form-item>
              <el-form-item label="详情">
                <el-input v-model="editorTaskModel.detail" />
              </el-form-item>
              <el-form-item label="记录">
                <el-input v-model="editorTaskModel.note" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-radio-group v-model="editorTaskModel.state">
                  <el-radio label="completed">完成</el-radio>
                  <el-radio label="timeout">超时</el-radio>
                  <el-radio label="discard">放弃</el-radio>
                  <el-radio label="normal">正常</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-drawer>
        </Teleport>
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
            <div>
              <div>
                {{ new Intl.DateTimeFormat('zh-Hans').format(index2Date(timeItem)) }}
              </div>
              <p>星期{{ date2Day(index2Date(timeItem)) }}</p>
            </div>
          </div>
        </div>
        <div id="container" ref="container" class="container"></div>
      </div>
      <div class="footer">
        <el-button @click="back2Today">today</el-button>
        <p class="footer-label">{{ graphRef?.getCurrentMode() }}</p>
        <el-button @click="handleNodeTest">NodeTest</el-button>
        <el-button @click="handleEdgeTest">EdgeTest</el-button>
        <p class="footer-label">{{ offset }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: hidden;

  .header {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 0 20px;

    .title {
      font-size: 24px;
      user-select: none;
      display: flex;
      justify-content: center;
    }

    .title-input {
      outline-style: none;
      border: 0;
      border-radius: 4px;
      font-size: 24px;
      background: #e2e2e2;
    }
  }

  .body {
    overflow: hidden;
    height: calc(100vh - 104px);
    padding: 24px 24px 16px 24px;

    .time-bar {
      z-index: 99;
      user-select: none;
      height: 40px;
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
