<script setup lang="ts">
import {Graph, type IEdge, Menu, ModelConfig} from '@antv/g6'
import type {EdgeConfig, IG6GraphEvent, INode, NodeConfig} from '@antv/g6-core'
import {type Item} from '@antv/g6-core'
import {v4 as uuidv4} from 'uuid'
import {computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue'
import PossibleGrid from '@renderer/g6/plugin/possibleGrid'
import {collision, date2Index, normalX} from '@renderer/util'
import {Delete, Promotion, SetUp} from '@element-plus/icons-vue'
import {useProjectStore} from '@renderer/store/project'
import router from '@renderer/router'
import {IProject, IRelation, ITask} from '@renderer/store'
import {debounce} from '@antv/util'
import {ElNotification} from 'element-plus'
import {autoLayout} from '@renderer/settings'
import {useTodayStore} from '@renderer/store/day'
import {PossibleTimeBar} from '@renderer/g6/plugin/possibleTimeBar'
import TitleBar from '@renderer/component/TitleBar.vue'
import {More, Local, Back, Next} from '@icon-park/vue-next'

const props = defineProps<{ id: string }>()
const projectStore = useProjectStore()
const todayStore = useTodayStore()

const container = ref<HTMLElement>()
let graph: Graph | null = null

const project = projectStore.get(props.id) as IProject

/**
 * 由于todayStore数据不是实时同步，会出现当前时间小于创建时间的错误，误差在1以内
 */
const dataIndex = () => {
  return date2Index(todayStore.today) - date2Index(project.initDate)
}

/**
 * time bar ref
 */
const timeBar = ref<HTMLElement>()

onMounted(() => {
  graph = new Graph({
    container: 'container',
    animate: true,
    animateCfg: {
      duration: 300
    },
    layout: {
      type: 'possible-layout',
      todayIndex: dataIndex()
    },
    plugins: [
      new PossibleGrid(),
      new PossibleTimeBar(project, timeBar.value as HTMLElement),
      new Menu({
        offsetX: -(container.value?.offsetLeft ?? 0),
        offsetY: -(container.value?.offsetTop ?? 0),
        getContent: () => '删除',
        handleMenuClick: (_: HTMLElement, item: Item) => {
          graph?.removeItem(item)
          if (autoLayout) {
            graph?.layout()
          }
        }
      }),
    ],
    modes: {
      default: [
        {
          type: 'drag-canvas',
          allowDragOnItem: false,
          enableOptimize: true,
          scalableRange: 99,
        },
        {
          type: 'possible-drag-node',
          enableOptimize: true,
        },
        {
          type: 'create-edge',
          trigger: 'drag',
          key: 'shift'
        }
      ],
    },
    defaultNode: {
      type: 'task-node'
    },
    defaultEdge: {
      type: 'cubic-horizontal'
    },
    edgeStateStyles: {
      hover: {
        stroke: 'rgba(154,154,154,0.38)',
        lineWidth: 2
      }
    }
  })

  const {x, y} = project.offset
  graph.data(projectStore.data(props.id))
  graph.render()
  graph.translate(x, y)

  graph.on('edge:mouseover', (e) => {
    graph?.setItemState(e.item as Item, 'hover', true)
  })

  graph.on('edge:mouseout', (e) => {
    graph?.setItemState(e.item as Item, 'hover', false)
  })

  // open drawer editor
  graph.on('node:dblclick', (e) => {
    if (graph?.getCurrentMode() === 'default') {
      editorModel.visible = true
      editorModel.taskId = (e.item as Item).getID()
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

  // graph.on('keydown', (e) => {
  //   if (e.key === 'Control') {
  //     graph?.setMode('edit')
  //   }
  // })
  //
  // graph.on('keyup', (e) => {
  //   if (e.key === 'Control') {
  //     graph?.setMode('default')
  //   }
  // })

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
    const {x, y} = graph?.getCanvasByPoint(0, 0) ?? {x: 0, y: 0}
    project.offset.x = x
    project.offset.y = y
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
    graph?.updateLayout({
      todayIndex: dataIndex()
    })
    graph?.emit('possible-update', {x: project.offset.x})
  })

  window.addEventListener('resize', () => {
    if (container.value) {
      graph?.changeSize(container.value.clientWidth, container.value.clientHeight)
    }
  })
})

onBeforeUnmount(() => {
  console.info('destroy graph')
  graph?.destroy()
})

/**
 * 回到今天时间点
 */
const back2Today = () => {
  const dx = dataIndex() * 120 + project.offset.x
  graph?.translate(-dx, -project.offset.y)
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
function exportProject() {
  const project = projectStore.get(props.id)
  window.api.exportProject(JSON.parse(JSON.stringify([project])))
}

const submitTitle = () => {
  titleEditEnable.value = false
}

const deleteDialogVisible = ref(false)

const handleDelete = () => {
  router.push({name: 'today'})
  projectStore.delete(props.id)
}

const editorModel = reactive({
  taskId: '',
  visible: false
})

const taskModel = computed(() => {
  const task = ref<ITask | ModelConfig>(graph?.findById(editorModel.taskId).getModel() ?? {})
  return new Proxy(task.value, {
    get: (target, p) => {
      return Reflect.get(target, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target, p, newValue)
      graph?.updateItem(target.id as string, target)
      return true
    }
  })
})

// const moveRight = () => {
//   console.log('move right today')
//   const d = new Date(todayStore.today)
//   d.setDate(d.getDate() + 1)
//   todayStore.update(d)
// }
//
// const rollback = () => {
//   console.log('rollback today')
//   const date = new Date()
//   console.log('date', date)
//   todayStore.update(date)
// }
//
// const moveLeft = () => {
//   console.log('move left today')
//   const d = new Date(todayStore.today)
//   d.setDate(d.getDate() - 1)
//   todayStore.update(d)
// }
</script>

<template>
  <div>
    <div class="main">
      <title-bar/>
      <div class="header">
        <div class="header-content">
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
          <el-dropdown class="operation-list" trigger="click">
            <more theme="outline" size="20" fill="#333" :strokeWidth="2"
                  style="width: 40px;display: flex;justify-content: end;align-items: end;"/>
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
      </div>
      <div class="body">
        <Teleport to="body">
          <el-drawer
              v-model="editorModel.visible"
              :close-on-click-modal="false"
              :show-close="true"
              @close="editorModel.visible = false"
          >
            <el-form :model="taskModel">
              <el-form-item label="名称">
                <el-input v-model="taskModel.name"/>
              </el-form-item>
              <el-form-item label="目标">
                <el-input v-model="taskModel.target"/>
              </el-form-item>
              <el-form-item label="详情">
                <el-input v-model="taskModel.detail" type="textarea"/>
              </el-form-item>
              <el-form-item label="记录">
                <el-input v-model="taskModel.note" type="textarea"/>
              </el-form-item>
              <el-form-item label="类型">
                <el-radio-group v-model="taskModel.taskType">
                  <el-radio label="period">周期</el-radio>
                  <el-radio label="schedule">定时</el-radio>
                  <el-radio label="general">一般</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="状态">
                <el-radio-group v-model="taskModel.state">
                  <el-radio label="completed">完成</el-radio>
                  <el-radio label="timeout">超时</el-radio>
                  <el-radio label="discard">放弃</el-radio>
                  <el-radio label="normal">正常</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-drawer>
        </Teleport>
        <div id="timeBar" ref="timeBar" class="time-bar"></div>
        <div id="container" ref="container" class="container"></div>
      </div>
      <div class="footer">
        <div class="icon-group">
          <local theme="outline" size="20" fill="#333" :strokeWidth="2" @click="back2Today" class="group-item"/>
          <back theme="outline" size="20" fill="#333" :strokeWidth="2" class="group-item"/>
          <next theme="outline" size="20" fill="#333" :strokeWidth="2" class="group-item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  overflow: hidden;
  border-radius: 8px 0 0 0;
  background: var(--color-project);
  box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px;
  display: grid;
  height: var(--app-height);
  grid-template-rows: 24px 40px 1fr 40px;

  .header {
    height: 100%;
    display: flex;
    justify-content: center;
    -webkit-app-region: drag;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .title {
        font-size: 20px;
        display: flex;
        justify-content: center;
        margin-left: 24px;
        -webkit-app-region: no-drag;
      }

      .title-input {
        outline-style: none;
        border: 0;
        border-radius: 4px;
        font-size: 20px;
        background: #e2e2e2;
        margin-left: 24px;
        -webkit-app-region: no-drag;
      }

      .operation-list {
        margin-right: 24px;
        -webkit-app-region: no-drag;
      }
    }
  }

  .body {
    overflow: hidden;
    height: 100%;
    padding: 24px 24px 24px 24px;
    display: grid;
    grid-template-rows: 40px calc(100% - 40px);
    box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;

    .time-bar {
      height: 100%;
      width: 100%;
    }

    .container {
      position: relative;
      height: 100%;
      width: calc(var(--app-width) - var(--side-width) - 48px);
      z-index: 1;
      background: var(--color-canvas);
    }
  }

  .footer {
    bottom: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 0 24px 0 24px;
    align-items: center;

    .icon-group {
      display: flex;
      align-items: center;

      .group-item {
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
  }
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
