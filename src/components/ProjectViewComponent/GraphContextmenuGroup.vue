<script setup lang="ts">
import emitter, { BusEvents } from '@/graph/emitter';
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
import { useCursor } from '@/stores/cursor';
import { useProjectStore } from '@/stores/project';
import { useSettings } from '@/stores/settings';
import type Project from '@/core/Project';
import type { ItemType } from '@/graph/types';
import { computed, onBeforeUnmount, ref } from 'vue';
import ContextmenuComponent from '@/components/ProjectViewComponent/ContextmenuComponent.vue';
import type { OptionType } from '@/components/types';

const projectStore = useProjectStore();
const container = ref<HTMLElement>();
const visible = ref(false);
const canvas = useCanvas();
const cursor = useCursor();
const itemType = ref<ItemType>('node');
const event = ref<PointerEvent>();

function createNode() {
  const settings = useSettings();
  const project = currentProject();
  const x = event.value.offsetX - project.offset.x;
  const y = event.value.offsetY - project.offset.y;
  const node = new Node();
  node.x = Math.floor(x / settings.unitWidth);
  node.y = Math.floor(y / settings.unitHeight);
  project.addNode(node);
  visible.value = false;
}

function handleAppendNode() {
  const project = currentProject();
  const el = event.value.target as Element;
  const key = el.getAttribute('data-key');
  const node = project.nodeMap.get(key);
  appendNode(<Project>project, node);
  visible.value = false;
}

function handleMoveUpWhole() {
  const project = currentProject();
  const el = event.value.target as Element;
  const key = el.getAttribute('data-key');
  const node = project.nodeMap.get(key);
  tryMoveUpWhole(<Project>project, node);
  visible.value = false;
}
function handleMoveDownWhole() {
  const project = currentProject();
  const el = event.value.target as Element;
  const key = el.getAttribute('data-key');
  const node = project.nodeMap.get(key);
  tryMoveDownWhole(<Project>project, node);
  visible.value = false;
}

function tryMoveRightNode() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  moveRight(<Project>project, project.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveLeftNode() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  moveLeft(<Project>project, project.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveDownNode() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  moveDown(<Project>project, project.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveUpNode() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  tryMoveUp(<Project>project, project.nodeMap.get(nodeId));
  visible.value = false;
}

function handleCompletedTask() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-key');
  const project = currentProject();
  const node = project.nodeMap.get(nodeId);
  node.completed = !node.completed;
  visible.value = false;
}

function handleDeleteTask() {
  const project = currentProject();
  const el = event.value.target as Element;
  const key = el.getAttribute('data-key');
  project.removeNode(key);
  visible.value = false;
  emitter.emit('home-editor');
}

function handleDeleteEdge() {
  const project = currentProject();
  const el = event.value.target as Element;
  const key = el.getAttribute('data-key');
  project.removeEdge(key);
  visible.value = false;
}

function breakAwayFromRelation() {
  const project = currentProject();
  const el = event.value.target as Element;
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
  const el = event.value.target as Element;
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

const nodeOptions: OptionType[] = [
  {
    name: '操作',
    group: [
      {
        title: '编辑',
        action() {
          emitter.emit(BusEvents['editor:open'], {
            event: event.value,
            id: (event.value.target as Element).getAttribute('data-key'),
            shapeType: itemType.value
          });
          visible.value = false;
        }
      },
      {
        title: '标记完成',
        icon: 'solar:check-read-line-duotone',
        action: handleCompletedTask
      }
    ]
  },
  {
    name: '移动操作',
    group: [
      {
        title: '追加节点',
        action: handleAppendNode
      },
      {
        title: '插入节点',
        action: insertNode
      },
      {
        title: '移动节点..',
        children: [
          {
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
          }
        ]
      }
    ]
  },
  {
    name: '删除',
    group: [
      {
        title: '脱离节点',
        action: breakAwayFromRelation
      },
      {
        title: '删除节点',
        icon: 'solar:notification-lines-remove-line-duotone',
        shortcut: 'Delete',
        action: handleDeleteTask
      }
    ]
  }
];

const canvasOptions: OptionType[] = [
  {
    name: '操作',
    group: [
      {
        title: '创建节点',
        action: createNode
      }
    ]
  }
];

const edgeOptions: OptionType[] = [
  {
    name: '操作',
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
  return options[itemType.value] ?? [];
});

emitter.on(
  BusEvents['graph:contextmenu'],
  ({ e, elementType }: { e: PointerEvent; elementType: ItemType }) => {
    visible.value = true;
    itemType.value = elementType;
    event.value = e;

    setTimeout(() => {
      cursor.setWithUnlock('default');
      container.value?.focus?.();
    });
  }
);

onBeforeUnmount(() => {
  emitter.off(BusEvents['graph:contextmenu']);
});
</script>

<template>
  <teleport to="body">
    <div v-if="visible" @blur="visible = false" tabindex="0" ref="container" class="container">
      <contextmenu-component
        :items="items"
        :canvas="canvas.svg"
        :x="event.x"
        :y="event.y"
        :parents="[]"
      />"
    </div>
  </teleport>
</template>

<style scoped>
.container {
  position: fixed;
  z-index: 4;
  background-color: #3a8ee6;
}
</style>
