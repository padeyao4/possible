<script lang="ts" setup>
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { emitter } from '@/utils';
import { generateIndex, type ID, useGraph } from '@/stores';
import { v4 } from 'uuid';

const { svg } = defineProps<{ svg: SVGSVGElement }>();
const graph = useGraph();

interface ConfType {
  name: string;
  icon?: string;
  action?: () => void;
  group?: ConfType[][];
}

/**
 * 菜单列表
 */
const conf = {
  node: <ConfType[][]>[
    [
      {
        name: '编辑',
        icon: 'edit',
        action: editeNode
      }
    ],
    [
      {
        name: '标记完成',
        action: markNodeDone
      },
      {
        name: '标记待办',
        action: markNodeTodo
      },
      {
        name: '追加节点',
        icon: 'append',
        action: () => {}
      },
      {
        name: '插入节点',
        icon: 'insert',
        action: () => {}
      }
    ],
    [
      {
        name: '删除',
        icon: 'delete',
        action: deleteNode
      }
    ]
  ],
  edge: <ConfType[][]>[
    [
      {
        name: '删除',
        icon: 'delete',
        action: deleteEdge
      }
    ]
  ],
  canvas: <ConfType[][]>[
    [
      {
        name: '创建节点',
        icon: 'add',
        action: createNode
      }
    ]
  ]
};

type MenuType = keyof typeof conf;

const menuRef = ref<HTMLElement | null>(null);

const menuModel = reactive({
  visible: false,
  top: 0, // 菜单栏距离顶部的距离
  left: 0, // 菜单栏距离左侧的距离
  /**
   * 鼠标点击的地址
   */
  position: {
    x: 0,
    y: 0
  },
  menuType: <MenuType>'canvas',
  itemId: <ID>undefined
});

emitter.on('open-canvas-menu', (param) => {
  menuModel.visible = true;
  menuModel.top = param.y;
  menuModel.left = param.x;
  menuModel.position.x = param.x;
  menuModel.position.y = param.y;
  menuModel.menuType = param.menuType;
  menuModel.itemId = param.itemId;
});

function deleteNode() {
  graph.removeNode(menuModel.itemId);
  menuModel.visible = false;
}

function editeNode() {
  emitter.emit('open-canvas-card-editor-by-menu', {
    x: menuModel.position.x,
    y: menuModel.position.y,
    nodeId: menuModel.itemId
  });
  menuModel.visible = false;
}

function markNodeDone() {
  graph.nodesMap.get(menuModel.itemId).status = true;
  menuModel.visible = false;
}

function markNodeTodo() {
  graph.nodesMap.get(menuModel.itemId).status = false;
  menuModel.visible = false;
}

function deleteEdge() {
  graph.removeEdge(menuModel.itemId);
  menuModel.visible = false;
  console.log(menuModel);
}

function createNode() {
  const project = graph.project;
  const svgBound = svg.getBoundingClientRect();
  graph.setNode({
    detail: '',
    h: 1,
    id: v4(),
    index: generateIndex(),
    name: 'untitled',
    projectId: project.id,
    record: '',
    status: false,
    w: 1,
    x: Math.floor((menuModel.position.x - svgBound.left - project.x) / graph.cardWidth),
    y: Math.floor((menuModel.position.y - svgBound.top - project.y) / graph.cardHeight)
  });
  menuModel.visible = false;
}

watchEffect(() => {
  // 解决焦点问题
  menuRef.value?.focus?.();
  // 监听菜单栏显示状态,调整菜单位置
  if (menuModel.visible && menuRef.value) {
    const svgBounding = svg.getBoundingClientRect();
    const menuBounding = menuRef.value?.getBoundingClientRect();
    if (menuBounding.right > svgBounding.right) {
      menuModel.left = svgBounding.right - menuBounding.width;
    }
    if (menuBounding.bottom > svgBounding.bottom) {
      menuModel.top = menuModel.top - (menuBounding.bottom - svgBounding.bottom);
    }
  }
});

const list = computed(() => {
  return conf[menuModel.menuType];
});
</script>

<template>
  <div
    v-if="menuModel.visible"
    ref="menuRef"
    :style="{ top: menuModel.top + 'px', left: menuModel.left + 'px' }"
    class="container"
    tabindex="0"
    @blur="menuModel.visible = false"
    @contextmenu.prevent
  >
    <div v-for="group in list" class="group">
      <div v-for="item in group" class="item" @click="item.action">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  z-index: 4;
  width: 200px;
  padding: 2px;
  background-color: #ffffff;
  border: 1px solid #00000020;
  border-radius: 5px;
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(247, 247, 249, 0.25);
  animation: fadeIn 200ms ease-in;
}

div:focus {
  outline: none;
}

.group {
  border-bottom: 1px solid #33333350;

  &:last-child {
    border-bottom: none;
  }
}

.item {
  display: flex;
  align-items: center;
  padding: 5px 10px;

  &:hover {
    background-color: #00000010;
  }
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
