<script setup lang="ts">
import {ModelConfig} from '@antv/g6'
import {computed, nextTick, reactive, ref} from 'vue'
import {Delete, Promotion, SetUp} from '@element-plus/icons-vue'
import {useProjectStore} from '@renderer/store/project'
import router from '@renderer/router'
import {IPosNode} from '@renderer/store'
import {useDateStore} from '@renderer/store/date'
import TitleBar from '@renderer/component/TitleBar.vue'
import {Aiming, ArrowLeft, ArrowRight, Back, ExperimentOne, Local, More, Next} from '@icon-park/vue-next'
import {useSettingsStore} from "@renderer/store/settings";
import {deltaIndex} from "@renderer/util/time";
import {useGraph} from "@renderer/g6";

const props = defineProps<{ id: string }>()
const projectStore = useProjectStore()
const dateStore = useDateStore()
const settings = useSettingsStore()

const container = ref<HTMLElement>()
const timeBar = ref<HTMLElement>()
const project = projectStore.get(props.id)

const {graphCall, saveGraphData} = useGraph(container, timeBar, project)

/**
 * 由于todayStore数据不是实时同步，会出现当前时间小于创建时间的错误，误差在1以内
 */
const dataIndex = () => {
  return deltaIndex(dateStore.now, project.initDate)
}

/**
 * 窗口移动到今天对应的x轴
 */
const move2Today = () => {
  graphCall((graph) => {
    const dx = dataIndex() * settings.cellWidth + project.offset.x
    graph?.translate(-dx, -project.offset.y)
  })()
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
  window.api.exportProject(JSON.stringify([projectStore.get(props.id)]))
}

const submitTitle = () => {
  if (project.name.trim() === '') {
    project.name = 'untitled'
  }
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
  const task = graphCall((graph) => {
    return ref<IPosNode | ModelConfig>(graph?.findById(editorModel.taskId).getModel() ?? {})
  })()
  return new Proxy(task.value, {
    get: (target, p) => {
      return Reflect.get(target, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target, p, newValue)
      graphCall((graph) => {
        graph?.updateItem(target.id as string, target)
      })()
      return true
    }
  })
})

function testGraph() {
  console.debug(dateStore.now)
}

const projectSettingsHover = ref(false)

function onClose() {
  saveGraphData()
  window.api.windowMainClose(JSON.stringify(projectStore.projects))
}

function onMaximize() {
  window.api.windowMainMaximize()
}

function onMinimize() {
  window.api.windowMainMinimize()
}

</script>

<template>
  <div>
    <div class="settings-button">
      <title-bar :close="onClose" :maximize="onMaximize"
                 :minimize="onMinimize"/>
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
          <div v-else class="title" @click="editTitle">
            <div class="text">{{ project.name }}</div>
          </div>
          <el-dropdown class="operation-list" trigger="click">
            <div style="height: 40px; display: flex; align-items: end">
              <div @mouseover="projectSettingsHover=true" @mouseleave="projectSettingsHover=false">
                <more v-if="projectSettingsHover" theme="outline" size="20" fill="#33333360" :strokeWidth="2"
                      style="display: flex;justify-content: center;align-items: center;"/>
                <more v-else theme="outline" size="20" fill="#333" :strokeWidth="2"
                      style="display: flex;justify-content: center;align-items: center;"/>
              </div>
            </div>
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
              modal-class="modal-class"
              class="editor-class"
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
          <local theme="outline" size="20" fill="#333" :strokeWidth="2" @click="move2Today"/>
          <back theme="outline" size="20" fill="#333" :strokeWidth="2"/>
          <next theme="outline" size="20" fill="#333" :strokeWidth="2"/>
          <experiment-one v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                          @click="testGraph"/>
          <arrow-left v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                      @click="() => {dateStore.addDay(-1)}"/>
          <aiming v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                  @click="() => {dateStore.update2Now()}"/>
          <arrow-right v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                       @click="() => {dateStore.addDay(1)}"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-button {
  overflow: hidden;
  border-radius: 8px 0 0 0;
  background: var(--color-project);
  box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px;
  display: grid;
  height: var(--win-height);
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
        margin-left: 24px;
        -webkit-app-region: no-drag;
        user-select: none;
        max-width: calc(var(--content-width) - 150px) !important;
      }

      .text {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
        word-break: break-all;
        white-space: nowrap;

        &:hover {
          cursor: text;
        }
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
      width: calc(var(--win-width) - var(--side-width) - 48px);
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

      > * {
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
