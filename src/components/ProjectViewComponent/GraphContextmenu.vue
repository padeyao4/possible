<script setup lang="ts">
import emitter from '@/graph/emitter';
import { clampMax } from '@/graph/math';
import {
  appendNode,
  currentProject,
  moveDown,
  moveLeft,
  moveRight,
  tryMoveDownWhole,
  tryMoveUp,
  tryMoveUpWhole
} from '@/service/project.service';
import Node from '@/core/Node';
import { useCanvas } from '@/stores/canvas';
import { useMouseStyle } from '@/stores/mouse';
import { useProjectStore } from '@/stores/project';
import { useSettings } from '@/stores/settings';
import { computed, onBeforeUnmount, ref } from 'vue';
import type Project from '@/core/Project';

const projectStore = useProjectStore();
const element = ref<HTMLElement>();
const top = ref(0);
const left = ref(0);
const visible = ref(false);
const canvas = useCanvas();
const mouseStyle = useMouseStyle();
const elementType = ref<'node' | 'canvas' | 'edge'>('node');
const currentMouseEvent = ref<PointerEvent>();

function createNode() {
  const settings = useSettings();
  const project = currentProject();
  const x = currentMouseEvent.value.offsetX - project.offset.x;
  const y = currentMouseEvent.value.offsetY - project.offset.y;
  const node = new Node();
  node.x = Math.floor(x / settings.unitWidth);
  node.y = Math.floor(y / settings.unitHeight);
  project.addNode(node);
  visible.value = false;
}

function handleAppendNode() {
  const project = currentProject();
  const el = currentMouseEvent.value.target as Element;
  const key = el.getAttribute('data-key');
  const node = project.nodeMap.get(key);
  appendNode(<Project>project, node);
  visible.value = false;
}

function handleMoveUpWhole() {
  const project = currentProject();
  const el = currentMouseEvent.value.target as Element;
  const key = el.getAttribute('data-key');
  const node = project.nodeMap.get(key);
  tryMoveUpWhole(<Project>project, node);
  visible.value = false;
}
function handleMoveDownWhole() {
  const project = currentProject();
  const el = currentMouseEvent.value.target as Element;
  const key = el.getAttribute('data-key');
  const node = project.nodeMap.get(key);
  tryMoveDownWhole(<Project>project, node);
  visible.value = false;
}

function tryMoveRightNode() {
  const target = currentMouseEvent.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  moveRight(<Project>project, project.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveLeftNode() {
  const target = currentMouseEvent.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  moveLeft(<Project>project, project.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveDownNode() {
  const target = currentMouseEvent.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  moveDown(<Project>project, project.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveUpNode() {
  const target = currentMouseEvent.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  tryMoveUp(<Project>project, project.nodeMap.get(nodeId));
  visible.value = false;
}

function handleCompletedTask() {
  const target = currentMouseEvent.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  const node = project.nodeMap.get(nodeId);
  node.completed = !node.completed;
  visible.value = false;
}

function handleDeleteTask() {
  const project = currentProject();
  const el = currentMouseEvent.value.target as Element;
  const key = el.getAttribute('data-key');
  project.removeNode(key);
  visible.value = false;
  emitter.emit('home-editor');
}

function handleDeleteEdge() {
  const project = currentProject();
  const el = currentMouseEvent.value.target as Element;
  const key = el.getAttribute('data-key');
  project.removeEdge(key);
  visible.value = false;
}

function breakAwayFromRelation() {
  const project = currentProject();
  const el = currentMouseEvent.value.target as Element;
  const nodeId = el.getAttribute('data-key');

  // 找到左侧关系节点
  const leftNodes = project.getRelationLeftNodes(nodeId);
  // 找到右侧关系节点
  const rightNodes = project.getRelationRightNodes(nodeId);
  // 左侧和右侧一一建立关系
  leftNodes.forEach((leftNode) => {
    rightNodes.forEach((rightNode) => {
      project.addEdge(leftNode, rightNode);
    });
  });
  // 删除当前节点所有边
  project.removeRelations(nodeId);
  visible.value = false;
}

function insertNode() {
  const project = projectStore.getCurrentProject();
  const el = currentMouseEvent.value.target as Element;
  const nodeId = el.getAttribute('data-key');
  const rightNode = project.getNode(nodeId);
  const sources = project.getRelationLeftNodes(nodeId);
  moveRight(<Project>project, rightNode);
  const newNode = new Node();
  newNode.name = '新节点';
  newNode.x = rightNode.x - 1;
  newNode.y = rightNode.y;
  project.addNode(newNode);
  // 删除旧边
  project.removeLeftRelations(nodeId);
  // 添加新边
  sources.forEach((source) => {
    project.addEdge(source, newNode);
  });
  project.addEdge(newNode, rightNode);
  visible.value = false;
}

const nodeOptions = [
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
      },
      {
        title: '插入节点',
        action: insertNode
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
        action: tryMoveRightNode
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
        title: '脱离节点',
        action: breakAwayFromRelation
      },
      {
        title: '删除节点',
        action: handleDeleteTask
      }
    ]
  }
];

const canvasOptions = [
  {
    name: '操作',
    borderStyle: {
      borderBottom: undefined
    },
    group: [
      {
        title: '创建节点',
        action: createNode
      }
    ]
  }
];

const edgeOptions = [
  {
    name: '操作',
    borderStyle: {
      borderBottom: undefined
    },
    group: [
      {
        title: '删除边',
        action: handleDeleteEdge
      }
    ]
  }
];

const options = {
  node: nodeOptions,
  canvas: canvasOptions,
  edge: edgeOptions
};

const items = computed(() => {
  return options[elementType.value];
});

emitter.on('contextmenu', ({ e: event, elementType: elType }: any) => {
  visible.value = true;
  elementType.value = elType;
  currentMouseEvent.value = event;

  setTimeout(() => {
    const b1 = element.value.getBoundingClientRect();
    const b2 = canvas.svg.getBoundingClientRect();
    left.value = clampMax(event.x, b2.right - b1.width);
    top.value = clampMax(event.y, b2.bottom - b1.height);
    mouseStyle.setStyleWithUnlock('default');
    element.value?.focus?.();
  });
});

const styleTop = computed(() => {
  return top.value + 'px';
});

const styleLeft = computed(() => {
  return left.value + 'px';
});

onBeforeUnmount(() => {
  emitter.off('contextmenu');
});
</script>

<template>
  <teleport to="body">
    <div
      v-show="visible"
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
  border: 1px solid #00000020;
  border-radius: 5px;
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(247, 247, 249, 0.25);
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
