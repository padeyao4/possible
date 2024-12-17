<script setup lang="ts">
import type { Card } from '@/stores';

/**
 * canvas卡片组件
 * data-graph-item-shape 属性表示graph中有哪些类型。node edge canvas
 * data-graph-item-id 属性表示节点id
 * data-graph-node-anchor 属性表示锚点类型。值可以为 left right
 * data-graph-node-resize-region 属性表示是否可以缩放。表示八个方向的调整方向
 */

defineProps<{
  card: Card;
}>();
</script>

<template>
  <g :transform="`translate(${card.x},${card.y})`">
    <rect :width="card.width" :height="card.height" opacity="1" stroke-width="1" stroke="#000" :fill="card.color"
      rx="8" />
    <foreignObject :width="card.width" :height="card.height" opacity="1">
      <div class="text">
        <p>
          {{ card.name }}
        </p>
      </div>
    </foreignObject>
    <rect :width="card.width" :height="card.height" opacity="0" :data-graph-item-id="card.id"
      data-graph-item-shape="node" data-mouse-style="pointer" class="key-shape" rx="8" />
    <g opacity="0">
      <rect :data-graph-item-id="card.id" data-mouse-style="nwse-resize" data-graph-item-shape="node"
        data-graph-node-resize-region="lt" x="-2.5" y="-2.5" fill="red" width="5" height="5" />
      <rect :data-graph-item-id="card.id" data-mouse-style="nesw-resize" data-graph-item-shape="node"
        data-graph-node-resize-region="rt" :x="card.width - 2.5" y="-2.5" fill="red" width="5" height="5" />
      <rect :data-graph-item-id="card.id" data-mouse-style="ns-resize" data-graph-item-shape="node"
        data-graph-node-resize-region="t" x="2.5" y="-2.5" :width="card.width - 5" height="5" />
      <rect :data-graph-item-id="card.id" data-graph-item-shape="node" data-mouse-style="ns-resize"
        data-graph-node-resize-region="b" x="2.5" :y="card.height - 2.5" :width="card.width - 5" height="5" />
      <rect :data-graph-item-id="card.id" data-graph-item-shape="node" data-mouse-style="ew-resize"
        data-graph-node-resize-region="l" x="-2.5" y="2.5" :width="5" :height="card.height - 5" />
      <rect :data-graph-item-id="card.id" data-graph-item-shape="node" data-mouse-style="ew-resize"
        data-graph-node-resize-region="r" :x="card.width - 2.5" y="2.5" :width="5" :height="card.height - 5" />
      <rect :data-graph-item-id="card.id" data-graph-item-shape="node" data-mouse-style="nesw-resize"
        data-graph-node-resize-region="lb" x="-2.5" :y="card.height - 2.5" fill="red" width="5" height="5" />
      <rect :data-graph-item-id="card.id" data-graph-item-shape="node" data-mouse-style="nwse-resize"
        data-graph-node-resize-region="rb" :x="card.width - 2.5" :y="card.height - 2.5" fill="red" width="5"
        height="5" />
    </g>
    <g class="anchor">
      <circle :cy="card.height / 2" r="5" stroke="#000" fill="#fff" stroke-width="0.8" data-mouse-style="pointer"
        data-graph-item-shape="node" :data-graph-item-id="card.id" data-graph-node-anchor="right" />
      <circle :cx="card.width" :cy="card.height / 2" r="5" stroke="#000" fill="#fff" stroke-width="0.8"
        data-mouse-style="pointer" data-graph-item-shape="node" :data-graph-item-id="card.id"
        data-graph-node-anchor="left" />
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
