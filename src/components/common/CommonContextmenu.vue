<script setup lang="ts">
import $bus from '@/lib/bus'
import { clampMax } from '@/lib/math'
import {
  appendNode,
  createNodeTemplate,
  currentProject,
  moveDown,
  moveLeft,
  moveRight,
  tryMoveDownWhole,
  tryMoveUp,
  tryMoveUpWhole
} from '@/service/project.service'
import { useCanvas } from '@/stores/canvas'
import { useMouseStyle } from '@/stores/mouse'
import { useProjects } from '@/stores/projects'
import { useSettings } from '@/stores/settings'
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue'

const element = ref<HTMLElement>()
const top = ref(0)
const left = ref(0)
const visible = ref(false)
const canvas = useCanvas()
const mouseStyle = useMouseStyle()
const elementType = ref<'node' | 'canvas' | 'edge'>('node')
const currentMouseEvent = ref<PointerEvent>()

function createNode() {
  const settings = useSettings()
  const project = currentProject()
  const x = currentMouseEvent.value.offsetX - project.offset.x
  const y = currentMouseEvent.value.offsetY - project.offset.y
  const node = createNodeTemplate()
  node.x = Math.floor(x / settings.unitWidth)
  node.y = Math.floor(y / settings.unitHeight)
  useProjects().addNode(project, node)
  visible.value = false
}

function handleAppendNode() {
  const project = currentProject()
  const el = currentMouseEvent.value.target as Element
  const key = el.getAttribute('data-key')
  const node = project.nodeMap.get(key)
  appendNode(project, node)
  visible.value = false
}

function handleMoveUpWhole() {
  const project = currentProject()
  const el = currentMouseEvent.value.target as Element
  const key = el.getAttribute('data-key')
  const node = project.nodeMap.get(key)
  tryMoveUpWhole(project, node)
  visible.value = false
}
function handleMoveDownWhole() {
  const project = currentProject()
  const el = currentMouseEvent.value.target as Element
  const key = el.getAttribute('data-key')
  const node = project.nodeMap.get(key)
  tryMoveDownWhole(project, node)
  visible.value = false
}

function tryMoveRgitNode() {
  const target = currentMouseEvent.value.target as Element
  const nodeId = target.getAttribute('data-key')
  const project = currentProject()
  moveRight(project, project.nodeMap.get(nodeId))
  visible.value = false
}

function tryMoveLeftNode() {
  const target = currentMouseEvent.value.target as Element
  const nodeId = target.getAttribute('data-key')
  const project = currentProject()
  moveLeft(project, project.nodeMap.get(nodeId))
  visible.value = false
}

function tryMoveDownNode() {
  const target = currentMouseEvent.value.target as Element
  const nodeId = target.getAttribute('data-key')
  const project = currentProject()
  moveDown(project, project.nodeMap.get(nodeId))
  visible.value = false
}

function tryMoveUpNode() {
  const target = currentMouseEvent.value.target as Element
  const nodeId = target.getAttribute('data-key')
  const project = currentProject()
  tryMoveUp(project, project.nodeMap.get(nodeId))
  visible.value = false
}

function handleCompletedTask() {
  const target = currentMouseEvent.value.target as Element
  const nodeId = target.getAttribute('data-key')
  const project = currentProject()
  const node = project.nodeMap.get(nodeId)
  node.completed = !node.completed
  visible.value = false
}

function handleDeleteTask() {
  const project = currentProject()
  const el = currentMouseEvent.value.target as Element
  const key = el.getAttribute('data-key')
  useProjects().removeNode(project, key)
  visible.value = false
  $bus.emit('home-editor')
}

function handleDeleteEdge() {
  const project = currentProject()
  const el = currentMouseEvent.value.target as Element
  const key = el.getAttribute('data-key')
  useProjects().removeEdge(project, key)
  visible.value = false
}

// '显示右侧节点': showRightCards,
// '显示左侧节点': showLefCards,
// '显示相关节点': showAllCards,

const data = {
  node: [
    {
      name: '操作',
      borderStyle: {
        borderBottom: '1px solid #33333350'
      },
      group: [
        {
          title: '标记完成',
          action: handleCompletedTask
        },
        {
          title: '追加节点',
          action: handleAppendNode
        }
      ]
    },
    {
      name: '移动操作',
      borderStyle: '',
      group: [
        {
          title: '向上推动',
          action: handleMoveUpWhole
        },
        {
          title: '向下推动',
          action: handleMoveDownWhole
        },
        {
          title: '向右移动',
          action: tryMoveRgitNode
        },
        {
          title: '向左移动',
          action: tryMoveLeftNode
        },
        {
          title: '向上移动',
          action: tryMoveUpNode
        },
        {
          title: '向下移动',
          action: tryMoveDownNode
        }
      ]
    },
    {
      name: '删除',
      borderStyle: {
        borderTop: '1px solid #33333350'
      },
      group: [
        {
          title: '删除节点',
          action: handleDeleteTask
        }
      ]
    }
  ],
  canvas: [
    {
      name: '操作',
      borderStyle: {
        borderBottom: '1px solid #33333350'
      },
      group: [
        {
          title: '创建节点',
          action: createNode
        }
      ]
    }
  ],
  edge: [
    {
      name: '操作',
      borderStyle: {
        borderBottom: '1px solid #33333350'
      },
      group: [
        {
          title: '删除边',
          action: handleDeleteEdge
        }
      ]
    }
  ]
}

const items = computed(() => {
  return data[elementType.value]
})

onBeforeMount(() => {
  $bus.on('contextmenu', ({ e: event, elementType: elType }: any) => {
    visible.value = true
    elementType.value = elType
    currentMouseEvent.value = event

    setTimeout(() => {
      const b1 = element.value.getBoundingClientRect()
      const b2 = canvas.svg.getBoundingClientRect()
      left.value = clampMax(event.x, b2.right - b1.width)
      top.value = clampMax(event.y, b2.bottom - b1.height)
      mouseStyle.setStyleWithUnlock('default')
      element.value?.focus?.()
    })
  })
})

const styleTop = computed(() => {
  return top.value + 'px'
})

const styleLeft = computed(() => {
  return left.value + 'px'
})

onBeforeUnmount(() => {
  $bus.off('contextmenu')
})
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="contextmenu"
      @contextmenu.prevent
      ref="element"
      tabindex="0"
      @blur="visible = false"
    >
      <div v-for="(group, i) in items" :key="i" :style="group.borderStyle" class="group">
        <div v-for="(value, j) in group.group" :key="j" class="item" @click="value.action">
          {{ value.title }}
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.contextmenu {
  position: fixed;
  top: v-bind(styleTop);
  left: v-bind(styleLeft);
  z-index: 3;
  display: v-bind(visible);
  flex-direction: column;
  width: 200px;
  background-color: var(--background-middle-color);
  border: 1px solid var(--border-default-color);
  border-radius: 6px;
  animation: fadeIn 200ms ease-in;
}
.contextmenu:focus {
  outline: none;
}

.group {
  padding: 4px;
}
.item {
  display: flex;
  align-items: center;
  justify-content: start;
  height: 25px;
  padding: 4px 24px;
  border-radius: 4px;
}

.item:hover {
  background-color: var(--background-active-color);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
