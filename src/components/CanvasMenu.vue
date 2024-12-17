<script lang="ts" setup>
import { CARD_HEIGHT, CARD_WIDTH, generateIndex, usePlanStore } from '@/stores';
import { emitter } from '@/utils';
import { v4 } from 'uuid';
import { computed, reactive, ref, watchEffect } from 'vue';

const { svg } = defineProps<{ svg: SVGSVGElement }>();
const planStore = usePlanStore();

interface ConfType {
  name: string;
  icon?: string;
  action?: () => void;
  group?: ConfType[][];
  visible?: boolean;
}

const isDev = import.meta.env.DEV;

/**
 * 菜单列表
 */
const conf = {
  node: [
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
        name: '追加计划',
        action: appendPlan
      },
      {
        name: '插入计划',
        action: insertPlan
      },
      {
        name: '测试',
        visible: isDev,
        action: test
      }
    ],
    [
      {
        name: '删除',
        icon: 'delete',
        action: deleteNode
      }
    ]
  ] as ConfType[][],
  edge: [
    [
      {
        name: '删除',
        icon: 'delete',
        action: deleteEdge
      }
    ]
  ] as ConfType[][],
  canvas: [
    [
      {
        name: '创建节点',
        icon: 'add',
        action: createNode
      }
    ]
  ] as ConfType[][]
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
  menuType: 'canvas' as MenuType,
  itemId: ''
});

emitter.on('open-canvas-menu', (param) => {
  menuModel.visible = true;
  menuModel.top = param.y;
  menuModel.left = param.x;
  menuModel.position.x = param.x;
  menuModel.position.y = param.y;
  menuModel.menuType = param.menuType;
  menuModel.itemId = param.itemId!;
});

function test() {
}


function deleteNode() {
  planStore.removePlan(menuModel.itemId);
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
  planStore.getPlan(menuModel.itemId)!.isDone = true;
  menuModel.visible = false;
}

function markNodeTodo() {
  planStore.getPlan(menuModel.itemId)!.isDone = false;
  menuModel.visible = false;
}

function deleteEdge() {
  const path = planStore.paths.find(path => path.id === menuModel.itemId);
  if (path?.fromId && path?.toId) {
    planStore.removeRelation(path.fromId, path.toId);
  }
  menuModel.visible = false;
}

function createNode() {
  const project = planStore.project;
  const bound = svg.getBoundingClientRect();

  planStore.addPlan({
    id: v4(),
    name: 'untitled',
    x: Math.floor((menuModel.position.x - bound.left - project!.offsetX!) / CARD_WIDTH),
    y: Math.floor((menuModel.position.y - bound.top - project!.offsetY!) / CARD_HEIGHT),
    width: 1,
    height: 1,
    createdAt: Date.now(),
    index: generateIndex(),
    parentId: project!.id,
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

function appendPlan(): void {
  planStore.appendPlan(menuModel.itemId);
  menuModel.visible = false;
}

function insertPlan(): void {
  planStore.insertPlan(menuModel.itemId);
  menuModel.visible = false;
}
</script>

<template>
  <div v-if="menuModel.visible" ref="menuRef" :style="{ top: menuModel.top + 'px', left: menuModel.left + 'px' }"
    class="container" tabindex="0" @blur="menuModel.visible = false" @contextmenu.prevent>
    <div v-for="(group, groupIndex) in list" :key="groupIndex" class="group">
      <template v-for="(item, itemIndex) in group" :key="itemIndex">
        <div v-if="item.visible === undefined || item.visible === true" class="item" @click="item.action">
          {{ item.name }}
        </div>
      </template>
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
