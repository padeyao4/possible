<script setup lang="ts">
import { inject, ref } from 'vue'
import OperationTip from '@/components/OperationTip.vue'
import { Inspection } from '@icon-park/vue-next'
import { useStore } from '@/stores/store'
import { dateToX } from '@/utils/time'

const store = useStore()

const active = ref(false)
const date = ref()
const graph = inject('graph') as any

function onClick() {
  active.value = true
}

function onActive(e: any) {
  setTimeout(() => {
    e?.focus()
  })
}

function onEnter(e: any) {
  if (date.value) {
    const project = store.currentProject
    const offset = dateToX(date.value, project.createTime) - 60
    const { x, y } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
    graph.value.translate({ dx: x - offset, dy: y })
  }
  e?.target?.blur()
  active.value = false
}
</script>

<template>
  <div>
    <template v-if="active">
      <el-date-picker
        v-model="date"
        style="width: 120px !important; user-select: none"
        type="date"
        placeholder="Pick a day"
        size="small"
        :ref="onActive"
        @keydown.enter="onEnter"
        @blur="onEnter"
      />
    </template>
    <template v-else>
      <operation-tip content="选择日期">
        <inspection
          theme="outline"
          size="20"
          fill="#333"
          :stroke-width="2"
          style="display: flex;justify-content: center;align-items: center;width: 24px;height: 24px"
          @click="onClick"
        />
      </operation-tip>
    </template>
  </div>
</template>