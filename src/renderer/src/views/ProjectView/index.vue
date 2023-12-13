<script setup lang="ts">
import {ref} from 'vue'
import {useDateStore} from '@renderer/store/date'
import TitleBar from '@renderer/component/TitleBar.vue'
import {Aiming, ArrowLeft, ArrowRight, Back, Next} from '@icon-park/vue-next'
import {useGraph} from "@renderer/g6";
import NodeEditor from "@renderer/views/ProjectView/component/NodeEditor.vue";
import CalendarButton from "@renderer/views/ProjectView/component/CalendarButton.vue";
import TodayButton from "@renderer/views/ProjectView/component/TodayButton.vue";
import CanvasMoveButtons from "@renderer/views/ProjectView/component/CanvasMoveButtons.vue";
import {useProject} from "@renderer/util/project";
import ProjectHeader from "@renderer/views/ProjectView/component/ProjectHeader.vue";
import {useStore} from "@renderer/store/project";

const dateStore = useDateStore()
const store = useStore()
const container = ref<HTMLElement>()
const timeBar = ref<HTMLElement>()
const project = useProject()!
const {graph, active, clearActive} = useGraph(container as any, timeBar as any)
</script>

<template>
  <div class="project-view">
    <title-bar :visible="true"/>
    <project-header/>
    <div class="project-body">
      <div id="timeBar" ref="timeBar" class="time-bar"></div>
      <div id="container" ref="container" class="container"></div>
    </div>
    <div class="footer">
      <div class="icon-group">
        <today-button :graph="graph" :project="project"/>
        <calendar-button :graph="graph" :project="project"/>
        <canvas-move-buttons :graph="graph"/>
        <back v-show="store.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
        <next v-show="store.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
        <arrow-left v-show="store.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                    @click="() => {dateStore.addDay(-1)}"/>
        <aiming v-show="store.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                @click="() => {dateStore.update2Now()}"/>
        <arrow-right v-show="store.experiment" theme="outline" size="20" fill="#333" :strokeWidth="2"
                     @click="() => {dateStore.addDay(1)}"/>
      </div>
    </div>
    <teleport to="body">
      <node-editor :node-id="active" :reset-node-id="clearActive" :graph="graph"/>
    </teleport>
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
