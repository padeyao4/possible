<script setup lang="ts">
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
      opacity="0.7"
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
      :data-item-id="data.id"
      data-item-type="node"
      data-mouse-style="pointer"
      class="key-shape"
      rx="8"
    />
    <g opacity="0">
      <rect
        :data-item-id="data.id"
        data-mouse-style="nwse-resize"
        data-type="node"
        data-item-type="resize"
        data-direction="lt"
        x="-2.5"
        y="-2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-item-id="data.id"
        data-mouse-style="nesw-resize"
        data-item-type="resize"
        data-type="node"
        data-direction="rt"
        :x="data.w - 2.5"
        y="-2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-item-id="data.id"
        data-mouse-style="ns-resize"
        data-item-type="resize"
        data-type="node"
        data-direction="t"
        x="2.5"
        y="-2.5"
        :width="data.w - 5"
        height="5"
      />
      <rect
        :data-item-id="data.id"
        data-item-type="resize"
        data-mouse-style="ns-resize"
        data-type="node"
        data-direction="b"
        x="2.5"
        :y="data.h - 2.5"
        :width="data.w - 5"
        height="5"
      />
      <rect
        :data-item-id="data.id"
        data-item-type="resize"
        data-mouse-style="ew-resize"
        data-type="node"
        data-direction="l"
        x="-2.5"
        y="2.5"
        :width="5"
        :height="data.h - 5"
      />
      <rect
        :data-item-id="data.id"
        data-item-type="resize"
        data-mouse-style="ew-resize"
        data-type="node"
        data-direction="r"
        :x="data.w - 2.5"
        y="2.5"
        :width="5"
        :height="data.h - 5"
      />
      <rect
        :data-item-id="data.id"
        data-item-type="resize"
        data-mouse-style="nesw-resize"
        data-type="node"
        data-direction="lb"
        x="-2.5"
        :y="data.h - 2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-item-id="data.id"
        data-item-type="resize"
        data-mouse-style="nwse-resize"
        data-type="node"
        data-direction="rb"
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
        data-type="node"
        data-mouse-style="pointer"
        data-item-type="anchor"
        :data-item-id="data.id"
        data-anchor="left"
      />
      <circle
        :cx="data.w"
        :cy="data.h / 2"
        r="5"
        stroke="#000"
        fill="#fff"
        stroke-width="0.8"
        data-type="node"
        data-mouse-style="pointer"
        data-item-type="anchor"
        :data-item-id="data.id"
        data-anchor="right"
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
