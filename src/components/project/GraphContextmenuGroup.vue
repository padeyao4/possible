<script lang="ts" setup>
import { emitter } from '@/utils';
// import {
//   appendNode,
//   moveDown,
//   moveLeft,
//   moveRight,
//   tryMoveDownWhole,
//   tryMoveUp,
//   tryMoveUpWhole
// } from '@/service/common';
// import type { Project } from '@/core';
import { type Project, useCursor } from '@/stores';
import { computed, type ComputedRef, inject, onBeforeUnmount, ref } from 'vue';
import ContextmenuComponent from '@/components/project/ContextmenuComponent.vue';
import type { OptionType } from '@/components/types';
export type ItemType = 'node' | 'edge' | 'canvas';

const container = ref<HTMLElement>();
const visible = ref(false);
const cursor = useCursor();
const itemType = ref<ItemType>('node');
const event = ref<PointerEvent>();
const project = inject<ComputedRef<Project>>('project');
// const settings = useSettings();

const element = computed(() => {
  return event.value.target as Element;
});

const elementId = computed(() => {
  return element.value.getAttribute('data-graph-item-id');
});

function handleAppendNode() {
  const el = event.value.target as Element;
  const key = el.getAttribute('data-graph-item-id');
  // const node = project.value.nodeMap.get(key);
  // appendNode(project.value, node);
  visible.value = false;
}

function handleMoveUpWhole() {
  const el = event.value.target as Element;
  const key = el.getAttribute('data-graph-item-id');
  // const node = project.value.nodeMap.get(key);
  // tryMoveUpWhole(<Project>project.value, node);
  visible.value = false;
}

function handleMoveDownWhole() {
  const el = event.value.target as Element;
  const key = el.getAttribute('data-graph-item-id');
  // const node = project.value.nodeMap.get(key);
  // tryMoveDownWhole(<Project>project.value, node);
  visible.value = false;
}

function tryMoveRightNode() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-graph-item-id');
  // moveRight(<Project>project.value, project.value.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveLeftNode() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-graph-item-id');
  // moveLeft(<Project>project.value, project.value.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveDownNode() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-graph-item-id');
  // moveDown(<Project>project.value, project.value.nodeMap.get(nodeId));
  visible.value = false;
}

function tryMoveUpNode() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-graph-item-id');
  // tryMoveUp(<Project>project.value, project.value.nodeMap.get(nodeId));
  visible.value = false;
}

function handleCompletedTask() {
  const target = event.value.target as Element;
  const nodeId = target.getAttribute('data-graph-item-id');
  // const node = project.value.nodeMap.get(nodeId);
  // node.completed = !node.completed;
  visible.value = false;
}

function handleDeleteEdge() {
  const el = event.value.target as Element;
  const edgeId = el.getAttribute('data-graph-item-id');
  // project.value.removeEdge(edgeId);
  visible.value = false;
}

function breakAwayFromRelation() {
  const el = event.value.target as Element;
  const nodeId = el.getAttribute('data-graph-item-id');

  // 找到左侧关系节点
  // const leftNodes = project.value.getRelationLeftNodes(nodeId);
  // // 找到右侧关系节点
  // const rightNodes = project.value.getRelationRightNodes(nodeId);
  // 左侧和右侧一一建立关系
  // leftNodes.forEach((leftNode) => {
  //   rightNodes.forEach((rightNode) => {
  //     project.value.addEdge(leftNode, rightNode);
  //   });
  // });
  // 删除当前节点所有边
  // project.value.removeRelations(nodeId);
  visible.value = false;
}

function insertNode() {
  // const el = event.value.target as Element;
  // const nodeId = el.getAttribute('data-graph-item-id');
  // const rightNode = project.value.getNode(nodeId);
  // const sources = project.value.getRelationLeftNodes(nodeId);
  // moveRight(<Project>project.value, rightNode);
  // const newNode = new Node();
  // newNode.name = '新节点';
  // newNode.x = rightNode.x - 1;
  // newNode.y = rightNode.y;
  // project.value.addNode(newNode);
  // // 删除旧边
  // project.value.removeLeftRelations(nodeId);
  // // 添加新边
  // sources.forEach((source) => {
  //   project.value.addEdge(source, newNode);
  // });
  // project.value.addEdge(newNode, rightNode);
  visible.value = false;
}

function pullRightNodes() {
  const el = event.value.target as Element;
  const nodeId = el.getAttribute('data-graph-item-id');
  // project.value.pullRightNode(nodeId);
  visible.value = false;
}

const nodeOptions: OptionType[] = [
  {
    name: '操作',
    group: [
      {
        title: '编辑',
        action() {
          // emitter.emit('editor:open', {
          //   item: project.value.getNode(elementId.value),
          //   type: 'node'
          // });
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
                title: '拉取',
                action: pullRightNodes
              },
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
        action: function () {
          const el = event.value.target as Element;
          const key = el.getAttribute('data-graph-item-id');
          // project.value.removeNode(key);
          visible.value = false;
        }
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
        action: function () {
          // const x = event.value.offsetX - project.value.offset.x;
          // const y = event.value.offsetY - project.value.offset.y;
          // const node = new Node();
          // node.x = Math.floor(x / settings.unitWidth);
          // node.y = Math.floor(y / settings.unitHeight);
          // project.value.addNode(node);
          // visible.value = false;
          // emitter.emit('node:create', node);
          // emitter.emit('editor:open', { type: 'node', item: node });
        }
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
  'contextmenu-canvas:open',
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
  emitter.off('contextmenu-canvas:open');
});
</script>

<template>
  <teleport to="body">
    <div v-if="visible" ref="container" class="container" tabindex="0" @blur="visible = false">
      <contextmenu-component :items="items" :parents="[]" :x="event.x" :y="event.y" />
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
