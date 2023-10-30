<script setup lang="ts">
import { Graph, type IEdge, Menu, ModelConfig } from '@antv/g6'
import type { EdgeConfig, IG6GraphEvent, INode, NodeConfig } from '@antv/g6-core'
import { type Item } from '@antv/g6-core'
import { v4 as uuidv4 } from 'uuid'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'
import PossibleGrid from '@renderer/g6/plugin/possibleGrid'
import { collision, date2Index, normalX } from '@renderer/util'
import { Delete, Promotion, SetUp } from '@element-plus/icons-vue'
import { useProjectStore } from '@renderer/store/project'
import router from '@renderer/router'
import { IProject, IRelation, ITask } from '@renderer/store'
import { debounce } from '@antv/util'
import { ElNotification } from 'element-plus'
import { autoLayout } from '@renderer/settings'
import { useTodayStore } from '@renderer/store/day'
import { PossibleTimeBar } from '@renderer/g6/plugin/possibleTimeBar'

const props = defineProps<{ id: string }>()
const projectStore = useProjectStore()
const todayStore = useTodayStore()

const container = ref<HTMLElement>()
let graph: Graph | null = null

const project = computed<IProject>(() => {
  return projectStore.get(props.id)
})

const todayIndex = computed(() => {
  console.log('computed today index', todayStore.today)
  return (
    date2Index(new Date(todayStore.today)) -
    date2Index(new Date(projectStore.get(props.id).initDate))
  )
})

onMounted(() => {
  console.debug('reload')
  graph = new Graph({
    container: 'container',
    animate: true,
    animateCfg: {
      duration: 300,
      callback() {
        console.log('layout finish')
      }
    },
    layout: {
      type: 'possible-layout',
      todayIndex: todayIndex.value,
      nodeHeight: 80,
      gap: 32
    },
    plugins: [
      new PossibleGrid(),
      new PossibleTimeBar({ baseDate: toRaw(project.value.initDate), today: todayStore.today }),
      new Menu({
        offsetX: -(container.value?.offsetLeft ?? 0),
        offsetY: -(container.value?.offsetTop ?? 0) - 40,
        getContent: () => '删除',
        handleMenuClick: (_: HTMLElement, item: Item) => {
          graph?.removeItem(item)
          if (autoLayout) {
            graph?.layout()
          }
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

  const { x, y } = project.value.offset
  graph.translate(x, y)
  graph.read(projectStore.data(props.id))

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
    const newTaskModel: ITask = {
      completedTime: undefined,
      createdTime: new Date(),
      id: uuidv4(),
      name: 'untitled',
      x: normalX(e.x),
      y: e.y,
      state: 'normal',
      detail: '',
      note: '',
      target: '',
      taskType: 'general'
    }
    const node = graph?.addItem('node', newTaskModel as unknown as ModelConfig) as INode
    if (autoLayout) {
      graph?.layout()
    } else {
      const collisionNodes = graph
        ?.getNodes()
        .filter((n) => n.getID() != node.getID())
        .filter((n) => collision(n.getBBox(), node.getBBox(), 0, 16))
      if (collisionNodes === undefined) {
        graph?.removeItem(node)
      } else if (collisionNodes.length == 0) {
        /* empty */
      } else if (collisionNodes.length == 1) {
        console.log('after', collisionNodes)
        const collisionNode = collisionNodes[0] as INode
        if ((collisionNode.getModel().y as number) > (node.getModel().y as number)) {
          node.getModel().y = (collisionNode.getModel().y as number) - node.getBBox().height - 8
        } else {
          node.getModel().y = (collisionNode.getModel().y as number) + node.getBBox().height + 8
        }
        graph?.updateItem(node.getID(), node.getModel())
      } else {
        graph?.removeItem(node)
        ElNotification({
          dangerouslyUseHTMLString: true,
          message:
            '<p style="user-select: none;font-size: 14px">画布空间不足，移动其他节点后创建</p>',
          type: 'warning',
          offset: 120,
          duration: 1500
        })
      }
    }
  })

  graph.on('node:dragend', () => {
    if (autoLayout) {
      graph?.layout()
    }
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

  graph.on('viewportchange', () => {
    // todo 防抖
    // const { x, y } = graph?.getCanvasByPoint(0, 0) ?? { x: 0, y: 0 }
    // project.value.offset.x = x
    // project.value.offset.y = y
  })
  graph.on('afterremoveitem', (e: IG6GraphEvent) => {
    if (e.type === 'node') {
      projectStore.deleteTask(props.id, (e.item as unknown as NodeConfig).id)
    }
    if (e.type === 'edge') {
      projectStore.deleteRelation(props.id, (e.item as unknown as EdgeConfig).id as string)
    }
  })
  graph.on('afteradditem', (e: IG6GraphEvent) => {
    if (e.item?.getType() === 'node') {
      projectStore.addTask(props.id, e.item.getModel() as unknown as ITask)
    }
    if (e.item?.getType() === 'edge') {
      projectStore.addRelation(props.id, e.item.getModel() as unknown as IRelation)
    }
  })
  graph.on(
    'afterupdateitem',
    debounce(function (e: IG6GraphEvent) {
      if (e.item?.getType() === 'node') {
        projectStore.updateTask(props.id, e.item.getModel() as unknown as ITask)
      }
      if (e.item?.getType() === 'edge') {
        projectStore.updateRelation(props.id, e.item.getModel() as unknown as IRelation)
      }
    }, 500)
  )

  watch(todayStore, () => {
    console.log('watch today index', todayIndex)
    graph?.updateLayout({
      todayIndex: todayIndex.value
    })
  })

  window.addEventListener('resize', () => {
    if (container.value) {
      graph?.changeSize(container.value.clientWidth, container.value.clientHeight)
    }
  })
})

onBeforeUnmount(() => {
  console.log('on before unmount')
  graph?.destroy()
})

/**
 * 回到今天时间点
 */
const back2Today = () => {
  const ox = project.value.offset.x
  const dx = todayIndex.value * 120 + ox
  graph?.translate(-dx, -project.value.offset.y)
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
  window.api.exportProject(JSON.parse(JSON.stringify([project])))
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
  console.log('computed editor task model')
  const task = graph?.findById(editorTaskId.value)?.getModel?.() as unknown as ITask
  return new Proxy(task, {
    get: (target, p) => {
      return Reflect.get(target, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target, p, newValue)
      graph?.updateItem(target.id, target as unknown as NodeConfig)
      return true
    }
  })
})

const moveRight = () => {
  console.log('move right today')
  const d = new Date(todayStore.today)
  d.setDate(d.getDate() + 1)
  todayStore.update(d)
}

const rollback = () => {
  console.log('rollback today')
  todayStore.update(new Date())
}

const moveLeft = () => {
  console.log('move left today')
  const d = new Date(todayStore.today)
  d.setDate(d.getDate() - 1)
  todayStore.update(d)
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
            v-model="project.name"
            class="title-input"
            @blur="submitTitle"
            @keydown.enter="submitTitle"
          />
          <div v-else class="title" @dblclick="editTitle">
            {{ project.name ?? '' }}
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
              >确定删除 <i style="font-size: large">{{ project.name ?? '' }} </i> 计划吗</span
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
                <el-input v-model="editorTaskModel.detail" type="textarea" />
              </el-form-item>
              <el-form-item label="记录">
                <el-input v-model="editorTaskModel.note" type="textarea" />
              </el-form-item>
              <el-form-item label="类型">
                <el-radio-group v-model="editorTaskModel.taskType">
                  <el-radio label="period">周期</el-radio>
                  <el-radio label="schedule">定时</el-radio>
                  <el-radio label="general">一般</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="状态">
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
        <div id="container" ref="container" class="container"></div>
      </div>
      <div class="footer">
        <el-button @click="back2Today">today</el-button>
        <!--        <p class="footer-label">{{ graphRef?.getCurrentMode() }}</p>-->
        <el-button @click="moveLeft">left</el-button>
        <el-button @click="rollback">back</el-button>
        <el-button @click="moveRight">right</el-button>
        <p class="footer-label">{{ project.offset }}</p>
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
        color: #159d8e;
      }
    }

    .container {
      display: inline-block;
      height: calc(100% - 40px);
      width: 100%;
      z-index: 1;
      position: relative;
    }
  }

  .footer {
    position: sticky;
    bottom: 0;
    height: 40px;
    background: #c7c5c5;
    display: flex;
    justify-content: space-between;
    padding: 0 24px 0 24px;
    align-items: center;

    .footer-label {
      color: #181818;
      background-color: #d0d0d0;
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
