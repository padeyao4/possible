<script setup lang="ts">
import { CARD_HEIGHT, CARD_WIDTH, generateIndex, usePlanStore } from '@/stores';
import { emitter } from '@/utils';
import { ArrowDown, ArrowRight, Check, Close, Delete, Edit, ArrowUp, Plus, Folder } from '@element-plus/icons-vue';
import { v4 } from 'uuid';
import { computed, nextTick, reactive, ref, watchEffect, type Component, onMounted, onUnmounted, markRaw } from 'vue';

const { svg } = defineProps<{ svg: SVGSVGElement }>();
const planStore = usePlanStore();

// 菜单项类型定义
interface MenuItem {
  name: string;
  icon?: Component;
  action?: () => void;
  visible?: boolean;
  subMenu?: MenuItem[];
  disabled?: boolean | (() => boolean);
}

type MenuGroup = MenuItem[][];
type MenuConfig = Record<MenuType, MenuGroup>;
type MenuType = 'node' | 'edge' | 'canvas';

// 菜单状态管理
const menuRef = ref<HTMLElement | null>(null);
const menuModel = reactive({
  visible: false,
  top: 0,
  left: 0,
  position: { x: 0, y: 0 },
  menuType: 'canvas' as MenuType,
  itemId: ''
});

// 菜单动作定义
const menuActions = {
  node: {
    edit: () => {
      emitter.emit('open-editor', {
        id: menuModel.itemId
      });
      hideMenu();
    },
    markDone: () => {
      planStore.setDone(menuModel.itemId);
      hideMenu();
    },
    markAllDone: () => {
      planStore.setAllDone(menuModel.itemId);
      hideMenu();
    },
    markTodo: () => {
      planStore.getPlan(menuModel.itemId)!.isDone = false;
      hideMenu();
    },
    append: () => {
      planStore.appendPlan(menuModel.itemId);
      hideMenu();
    },
    insert: () => {
      planStore.insertPlan(menuModel.itemId);
      hideMenu();
    },
    addChild: () => {
      const parent = planStore.getPlan(menuModel.itemId)!;
      const addChildPlan = (parentId: string, position: { x: number, y: number }) => {
        // 递归获取父节点的坐标累加值
        const getParentOffset = (parentId: string): { x: number, y: number } => {
          const parent = planStore.getPlan(parentId);
          if (!parent) return { x: 0, y: 0 };

          const offset = { x: parent.x!, y: parent.y! };

          if (parent.parentId) {
            const parentOffset = getParentOffset(parent.parentId);
            offset.x += parentOffset.x;
            offset.y += parentOffset.y;
          }
          return offset;
        };

        const parentOffset = getParentOffset(parentId);
        const bound = svg.getBoundingClientRect();
        const project = planStore.project;

        planStore.addPlan({
          id: v4(),
          name: '未命名',
          x: Math.floor((position.x - bound.left - project!.offsetX!) / CARD_WIDTH) - parentOffset.x,
          y: Math.floor((position.y - bound.top - project!.offsetY!) / CARD_HEIGHT) - parentOffset.y,
          width: 1,
          height: 1,
          index: generateIndex(),
          isDone: false,
          createdAt: Date.now(),
          parentId: parentId,
        });
      };

      addChildPlan(parent.id, menuModel.position);
      hideMenu();
    },
    detach: () => {
      planStore.detachPlan(menuModel.itemId);
      hideMenu();
    },
    delete: () => {
      planStore.removePlan(menuModel.itemId);
      hideMenu();
    },
    expand: () => {
      planStore.getPlan(menuModel.itemId)!.isExpanded = true;
      hideMenu();
    },
    collapse: () => {
      planStore.getPlan(menuModel.itemId)!.isExpanded = false;
      hideMenu();
    }
  },
  edge: {
    delete: () => {
      const path = planStore.paths.find(path => path.id === menuModel.itemId);
      if (path?.fromId && path?.toId) {
        planStore.removeRelation(path.fromId, path.toId);
      }
      hideMenu();
    }
  },
  canvas: {
    create: () => {
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
      hideMenu();
    }
  }
};

// 菜单配置
const menuConfig: MenuConfig = {
  node: [
    [{
      name: '编辑详情',
      icon: markRaw(Edit),
      action: menuActions.node.edit
    }],
    [
      {
        name: '任务状态',
        icon: markRaw(Check),
        subMenu: [
          {
            name: '完成',
            icon: markRaw(Check),
            action: menuActions.node.markDone,
            disabled: () => planStore.getPlan(menuModel.itemId)?.isDone!
          },
          {
            name: '重新开始',
            icon: markRaw(Close),
            action: menuActions.node.markTodo,
            disabled: () => !planStore.getPlan(menuModel.itemId)?.isDone
          },
          {
            name: '完成所有子任务',
            icon: markRaw(Check),
            action: menuActions.node.markAllDone,
            disabled: () => planStore.getPlan(menuModel.itemId)?.isDone!
          }
        ]
      },
      {
        name: '计划管理',
        icon: markRaw(Plus),
        subMenu: [
          {
            name: '后续计划',
            icon: markRaw(ArrowRight),
            action: menuActions.node.append
          },
          {
            name: '插入计划',
            icon: markRaw(ArrowDown),
            action: menuActions.node.insert
          },
          {
            name: '子计划',
            icon: markRaw(Folder),
            action: menuActions.node.addChild
          }
        ]
      },
      {
        name: '视图控制',
        icon: markRaw(ArrowDown),
        subMenu: [
          {
            name: '展开详情',
            icon: markRaw(ArrowDown),
            action: menuActions.node.expand,
            disabled: () => planStore.getPlan(menuModel.itemId)?.isExpanded!
          },
          {
            name: '收起详情',
            icon: markRaw(ArrowUp),
            action: menuActions.node.collapse,
            disabled: () => !(planStore.getPlan(menuModel.itemId)?.isExpanded)
          }
        ]
      }
    ],
    [{
      name: '解除关联',
      icon: markRaw(Close),
      action: menuActions.node.detach
    },
    {
      name: '删除计划',
      icon: markRaw(Delete),
      action: menuActions.node.delete
    }]
  ],
  edge: [
    [{
      name: '移除连接',
      icon: markRaw(Delete),
      action: menuActions.edge.delete
    }]
  ],
  canvas: [
    [{
      name: '新建计划',
      icon: markRaw(Plus),
      action: menuActions.canvas.create
    }]
  ]
};

// 计算当前菜单列表
const menuList = computed(() => menuConfig[menuModel.menuType]);

// 显示/隐藏菜单
function hideMenu() {
  menuModel.visible = false;
}

watchEffect(() => {
  if (menuRef.value) {
    menuRef.value.focus();
  }
});

// 监听菜单打开事件
emitter.on('open-canvas-menu', (param) => {
  // 重置子菜单状态为 null，即关闭
  currentSubMenu.value = null;
  currentSubMenuPosition.value = { top: 0, left: 0 };
  currentSubMenuDirection.value = 'right';

  // 其他菜单打开逻辑
  menuModel.visible = true;
  menuModel.top = param.y;
  menuModel.left = param.x;
  menuModel.position = { x: param.x, y: param.y };
  menuModel.menuType = param.menuType;
  menuModel.itemId = param.itemId!;

  // 下一个tick调整菜单位置
  nextTick(() => {
    if (!menuRef.value) return;

    const svgBound = svg.getBoundingClientRect();
    const menuBound = menuRef.value.getBoundingClientRect();

    // 确保菜单不超出视图范围
    if (menuBound.right > svgBound.right) {
      menuModel.left = svgBound.right - menuBound.width;
    }
    if (menuBound.bottom > svgBound.bottom) {
      menuModel.top = menuModel.top - (menuBound.bottom - svgBound.bottom);
    }
  });
});

// 新增子菜单相关状态
const currentSubMenu = ref<MenuItem[] | null>(null);
const currentSubMenuPosition = ref<{ top: number; left: number }>({ top: 0, left: 0 });
const currentSubMenuDirection = ref<'right' | 'left'>('right');

// 添加 SVG 大小变化监听
const resizeObserver = ref<ResizeObserver | null>(null);

onMounted(() => {
  // 创建 ResizeObserver 监听 SVG 大小变化
  resizeObserver.value = new ResizeObserver(() => {
    // 如果子菜单已经打开，重新计算位置
    if (currentSubMenu.value && menuRef.value) {
      const menuContainer = menuRef.value;
      const targetElement = menuContainer.querySelector('.menu-item:hover');

      if (targetElement) {
        const event = new MouseEvent('mouseenter', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        targetElement.dispatchEvent(event);
      }
    }
  });

  // 开始监听 SVG
  if (svg) {
    resizeObserver.value.observe(svg);
  }
});

onUnmounted(() => {
  // 清理 ResizeObserver
  if (resizeObserver.value && svg) {
    resizeObserver.value.unobserve(svg);
    resizeObserver.value = null;
  }
});

// 处理菜单项悬停事件
function handleMenuItemHover(item: MenuItem, event: MouseEvent) {
  if (item.subMenu) {
    currentSubMenu.value = item.subMenu;

    // 计算子菜单位置
    const targetElement = event.currentTarget as HTMLElement;
    const menuContainer = menuRef.value;

    if (targetElement && menuContainer) {
      const targetRect = targetElement.getBoundingClientRect();
      const menuRect = menuContainer.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect(); // 获取最新的 SVG 大小

      // 默认在右侧
      let subMenuLeft = menuRect.right;
      let subMenuDirection: 'right' | 'left' = 'right';

      // 检查是否超出屏幕右侧
      if (subMenuLeft + 200 > svgRect.right) {
        // 切换到左侧
        subMenuLeft = menuRect.left - 200;
        subMenuDirection = 'left';
      }

      currentSubMenuPosition.value = {
        top: targetRect.top - menuRect.top,
        left: subMenuLeft - menuRect.left
      };
      currentSubMenuDirection.value = subMenuDirection;
    }
  } else {
    currentSubMenu.value = null;
  }
}

// 处理菜单项点击事件
function handleMenuItemClick(item: MenuItem) {
  if (typeof item.disabled === 'function' && item.disabled()) return;

  if (item.action) {
    item.action();
    hideMenu();
  }
}

// 检查菜单项是否禁用
function isItemDisabled(item: MenuItem): boolean {
  if (typeof item.disabled === 'function') {
    return item.disabled();
  }
  return !!item.disabled;
}
</script>

<template>
  <div v-if="menuModel.visible" ref="menuRef" :style="{ top: menuModel.top + 'px', left: menuModel.left + 'px' }"
    class="menu-container" tabindex="0" @blur="hideMenu" @contextmenu.prevent>
    <div class="menu-content">
      <div v-for="(group, groupIndex) in menuList" :key="groupIndex" class="menu-group">
        <template v-for="(item, itemIndex) in group" :key="itemIndex">
          <div v-if="item.visible !== false" class="menu-item" :class="{ 'menu-item-disabled': isItemDisabled(item) }"
            @click="handleMenuItemClick(item)" @mouseenter="handleMenuItemHover(item, $event)">
            <el-icon v-if="item.icon">
              <component :is="markRaw(item.icon)" />
            </el-icon>
            <span>{{ item.name }}</span>
            <el-icon v-if="item.subMenu" class="submenu-indicator">
              <component :is="markRaw(ArrowRight)" />
            </el-icon>
          </div>
        </template>
      </div>
    </div>

    <!-- 子菜单 -->
    <div v-if="currentSubMenu" class="submenu" :class="{ 'submenu-left': currentSubMenuDirection === 'left' }" :style="{
      top: `${currentSubMenuPosition.top}px`,
      left: `${currentSubMenuPosition.left}px`
    }">
      <div v-for="(subItem, index) in currentSubMenu" :key="index" class="menu-item"
        :class="{ 'menu-item-disabled': isItemDisabled(subItem) }" @click="handleMenuItemClick(subItem)">
        <el-icon v-if="subItem.icon">
          <component :is="markRaw(subItem.icon)" />
        </el-icon>
        <span>{{ subItem.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-container {
  position: fixed;
  z-index: 4;
  width: 200px;
  padding: 4px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fadeIn 150ms ease-out;
  outline: none;
}

.menu-group {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:last-child {
    border-bottom: none;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  min-height: 32px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    color: #409EFF;
  }

  .el-icon {
    font-size: 16px;
    width: 16px;
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 添加子菜单样式 */
.submenu {
  position: absolute;
  width: 200px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 5;
}

.submenu-left {
  left: auto;
  right: 100%;
}

.submenu-indicator {
  margin-left: auto;
  opacity: 0.5;
}
</style>
