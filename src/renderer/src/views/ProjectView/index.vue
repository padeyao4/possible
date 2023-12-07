<script setup lang="ts">
import {IGraph} from '@antv/g6'
import {ref} from 'vue'
import {useDateStore} from '@renderer/store/date'
import TitleBar from '@renderer/component/TitleBar.vue'
import {Aiming, ArrowLeft, ArrowRight, Back, Next} from '@icon-park/vue-next'
import {useSettingsStore} from "@renderer/store/settings";
import {useGraph} from "@renderer/g6";
import NodeEditor from "@renderer/views/ProjectView/component/NodeEditor.vue";
import {IG6GraphEvent} from "@antv/g6-core";
import CalendarButton from "@renderer/views/ProjectView/component/CalendarButton.vue";
import TodayButton from "@renderer/views/ProjectView/component/TodayButton.vue";
import CanvasMoveButtons from "@renderer/views/ProjectView/component/CanvasMoveButtons.vue";
import {Possible} from "@renderer/model";
import {useProject} from "@renderer/util/project";
import ProjectHeader from "@renderer/views/ProjectView/component/ProjectHeader.vue";
import INode = Possible.INode;

const dateStore = useDateStore()
const settings = useSettingsStore()

const container = ref<HTMLElement>()
const timeBar = ref<HTMLElement>()
const project = useProject()!

const editor = {
  visible: ref(false),
  model: {} as INode
}

function onNodeClick(e: IG6GraphEvent, graph: IGraph | null) {
  editor.visible.value = true
  const node = ref((graph?.findById(e.item?.getID() as string).getModel() ?? {}) as any)
  editor.model = new Proxy<INode>(node.value, {
    get: (target, p) => {
      return Reflect.get(target, p)
    },
    set: (target, p, newValue) => {
      Reflect.set(target, p, newValue)
      graph?.updateItem(target.id, target)
      return true
    }
  })
}

const {graph} = useGraph(container as any, timeBar as any, onNodeClick)

</script>

<template>
  <div class="project-view">
    <title-bar :visible="true" :on-before-close="undefined"/>
    <project-header/>
    <div class="project-body">
      <Teleport to="body">
        <node-editor v-model:visible="editor.visible.value" v-model:node="editor.model"/>
      </Teleport>
      <div id="timeBar" ref="timeBar" class="time-bar"></div>
      <div id="container" ref="container" class="container"></div>
    </div>
    <div class="footer">
      <div class="icon-group">
        <today-button :graph="graph" :project="project"/>
        <calendar-button :graph="graph" :project="project"/>
        <canvas-move-buttons :graph="graph"/>
        <back v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
        <next v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
        <arrow-left v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                    @click="() => {dateStore.addDay(-1)}"/>
        <aiming v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                @click="() => {dateStore.update2Now()}"/>
        <arrow-right v-show="settings.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                     @click="() => {dateStore.addDay(1)}"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-view {
  overflow: hidden;
  border-radius: 8px 0 0 0;
  background: var(--color-project);
  box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px;
  display: grid;
  height: var(--win-height);
  grid-template-rows: 24px 40px 1fr 40px;

  .project-body {
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
    }
  }
}
</style>
