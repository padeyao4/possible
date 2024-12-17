<script setup lang="ts">
import type { Card } from '@/stores';

defineProps<{
  card: Card;
}>();

// 公共属性
const nodeAttrs = {
  'data-graph-item-shape': 'node',
  'data-mouse-style': 'pointer'
} as const;

// 调整大小的控制点配置
type ResizePoint = {
  region: string;
  style: string;
  x: number | null;
  y: number | null;
  wide?: boolean;
  tall?: boolean;
  visible?: boolean; // 控制点是否可见
  corner?: boolean; // 添加corner标记
};

const RESIZE_HANDLE_SIZE = 6;
const HANDLE_OFFSET = RESIZE_HANDLE_SIZE / 2;

const resizePoints: ResizePoint[] = [
  {
    region: 'lt',
    style: 'nwse-resize',
    x: -HANDLE_OFFSET,
    y: -HANDLE_OFFSET,
    visible: true,
    corner: true
  },
  {
    region: 'rt',
    style: 'nesw-resize',
    x: null,
    y: -HANDLE_OFFSET,
    visible: true,
    corner: true
  },
  {
    region: 't',
    style: 'ns-resize',
    x: HANDLE_OFFSET,
    y: -HANDLE_OFFSET,
    wide: true
  },
  { region: 'b', style: 'ns-resize', x: 2.5, y: null, wide: true },
  { region: 'l', style: 'ew-resize', x: -2.5, y: 2.5, tall: true },
  { region: 'r', style: 'ew-resize', x: null, y: 2.5, tall: true },
  { region: 'lb', style: 'nesw-resize', x: -2.5, y: null },
  { region: 'rb', style: 'nwse-resize', x: null, y: null }
];
</script>

<template>
  <g :transform="`translate(${card.x},${card.y})`">
    <!-- 卡片主体 -->
    <rect :width="card.width" :height="card.height" stroke-width="1" stroke="#000" :fill="card.color" rx="8" />

    <!-- 卡片内容 -->
    <foreignObject :width="card.width" :height="card.height">
      <div class="text">
        <p>{{ card.name }}</p>
      </div>
    </foreignObject>

    <!-- 交互区域 -->
    <rect v-bind="nodeAttrs" :width="card.width" :height="card.height" :data-graph-item-id="card.id" class="key-shape"
      opacity="0" rx="8" />

    <!-- 调整大小的控制点 -->
    <g class="resize-handles" opacity="0">
      <template v-for="point in resizePoints" :key="point.region">
        <rect v-if="point.visible !== false" v-bind="nodeAttrs" :data-graph-item-id="card.id"
          :data-mouse-style="point.style" :data-graph-node-resize-region="point.region"
          :x="point.x ?? card.width - HANDLE_OFFSET" :y="point.y ?? card.height - HANDLE_OFFSET"
          :width="point.wide ? card.width - RESIZE_HANDLE_SIZE : RESIZE_HANDLE_SIZE"
          :height="point.tall ? card.height - RESIZE_HANDLE_SIZE : RESIZE_HANDLE_SIZE"
          :class="[point.region, { corner: point.corner }]" />
      </template>
    </g>

    <!-- 连接锚点 -->
    <g class="anchor">
      <template v-for="(anchor, i) in ['right', 'left']" :key="anchor">
        <circle v-bind="nodeAttrs" :data-graph-item-id="card.id" :data-graph-node-anchor="anchor" :cx="i * card.width"
          :cy="card.height / 2" r="5" stroke="#000" fill="#fff" stroke-width="0.8" />
      </template>
    </g>
  </g>
</template>

<style scoped>
.anchor {
  opacity: 0;

  &:hover {
    opacity: 1;
  }
}

.key-shape:hover~.anchor {
  opacity: 1;
}

.text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;

  p {
    display: -webkit-box;
    font-weight: 100;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    word-wrap: break-word;
    word-break: break-all;
    -webkit-box-orient: vertical;
  }
}
</style>
