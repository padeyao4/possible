<script setup lang="ts">
/**
 * canvas卡片组件
 * data-graph-item-shape 属性表示graph中有哪些类型。node edge canvas
 * data-graph-item-id 属性表示节点id
 * data-graph-node-anchor 属性表示锚点类型。值可以为 source和target。source表示边的起点节点
 * data-graph-node-resize-region 属性表示是否可以缩放。表示八个方向的调整方向
 */
import { type ID } from '@/stores';

defineProps<{
  data: {
    x: number;
    y: number;
    w: number;
    h: number;
    name: string;
    color: string;
    id: ID;
  };
}>();
</script>

<template>
  <g :transform="`translate(${data.x},${data.y})`">
    <rect
      :width="data.w"
      :height="data.h"
      opacity="1"
      stroke-width="1"
      stroke="#000"
      :fill="data.color"
      rx="8"
    />
    <foreignObject :width="data.w" :height="data.h" opacity="1">
      <div class="text">
        <p>
          {{ data.name }}
        </p>
      </div>
    </foreignObject>
    <rect
      :width="data.w"
      :height="data.h"
      opacity="0"
      :data-graph-item-id="data.id"
      data-graph-item-shape="node"
      data-mouse-style="pointer"
      class="key-shape"
      rx="8"
    />
    <g opacity="0">
      <rect
        :data-graph-item-id="data.id"
        data-mouse-style="nwse-resize"
        data-graph-item-shape="node"
        data-graph-node-resize-region="lt"
        x="-2.5"
        y="-2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-graph-item-id="data.id"
        data-mouse-style="nesw-resize"
        data-graph-item-shape="node"
        data-graph-node-resize-region="rt"
        :x="data.w - 2.5"
        y="-2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-graph-item-id="data.id"
        data-mouse-style="ns-resize"
        data-graph-item-shape="node"
        data-graph-node-resize-region="t"
        x="2.5"
        y="-2.5"
        :width="data.w - 5"
        height="5"
      />
      <rect
        :data-graph-item-id="data.id"
        data-graph-item-shape="node"
        data-mouse-style="ns-resize"
        data-graph-node-resize-region="b"
        x="2.5"
        :y="data.h - 2.5"
        :width="data.w - 5"
        height="5"
      />
      <rect
        :data-graph-item-id="data.id"
        data-graph-item-shape="node"
        data-mouse-style="ew-resize"
        data-graph-node-resize-region="l"
        x="-2.5"
        y="2.5"
        :width="5"
        :height="data.h - 5"
      />
      <rect
        :data-graph-item-id="data.id"
        data-graph-item-shape="node"
        data-mouse-style="ew-resize"
        data-graph-node-resize-region="r"
        :x="data.w - 2.5"
        y="2.5"
        :width="5"
        :height="data.h - 5"
      />
      <rect
        :data-graph-item-id="data.id"
        data-graph-item-shape="node"
        data-mouse-style="nesw-resize"
        data-graph-node-resize-region="lb"
        x="-2.5"
        :y="data.h - 2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-graph-item-id="data.id"
        data-graph-item-shape="node"
        data-mouse-style="nwse-resize"
        data-graph-node-resize-region="rb"
        :x="data.w - 2.5"
        :y="data.h - 2.5"
        fill="red"
        width="5"
        height="5"
      />
    </g>
    <g class="anchor">
      <circle
        :cy="data.h / 2"
        r="5"
        stroke="#000"
        fill="#fff"
        stroke-width="0.8"
        data-mouse-style="pointer"
        data-graph-item-shape="node"
        :data-graph-item-id="data.id"
        data-graph-node-anchor="target"
      />
      <circle
        :cx="data.w"
        :cy="data.h / 2"
        r="5"
        stroke="#000"
        fill="#fff"
        stroke-width="0.8"
        data-mouse-style="pointer"
        data-graph-item-shape="node"
        :data-graph-item-id="data.id"
        data-graph-node-anchor="source"
      />
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

.key-shape:hover ~ .anchor {
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
    align-items: center;
    justify-content: center;
    font-weight: 100;
    font-size: 13px;
    /*此处设置字体高度要和框高一起计算*/
    line-height: 20px;
    text-align: center;
    word-wrap: break-word;
    word-break: break-all;
    -webkit-box-orient: vertical;
  }
}
</style>
