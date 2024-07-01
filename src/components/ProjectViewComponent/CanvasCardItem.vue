<script setup lang="ts">
import { computed } from 'vue';
import { useSettings } from '@/stores/settings';
import Node from '@/core/Node';

const props = defineProps<{ node: Node }>();
const settings = useSettings();

const { node } = props;

const translateX = computed(() => {
  return node.x * settings.unitWidth + settings.offsetCardX;
});

const translateY = computed(() => {
  return node.y * settings.unitHeight + settings.offsetCardY;
});

const width = computed(() => {
  return node.width * settings.unitWidth - settings.offsetCardX * 2;
});

const height = computed(() => {
  return node.height * settings.unitHeight - settings.offsetCardY * 2;
});

const backgroundColor = computed(() => {
  return node.completed ? '#dddddd' : '#fff';
});

const taskName = computed(() => {
  return node.name.trim() === '' ? '未命名' : node.name;
});

const lineCount = computed(() => {
  return Math.floor(height.value / 20);
});
</script>

<template>
  <g :transform="`translate(${translateX},${translateY})`">
    <rect
      :width="width"
      :height="height"
      opacity="0.7"
      stroke-width="1"
      stroke="#000"
      :fill="backgroundColor"
      rx="8"
    />
    <foreignObject :width="width" :height="height" opacity="1">
      <div class="text">
        <p>
          {{ taskName }}
        </p>
      </div>
    </foreignObject>
    <rect
      :width="width"
      :height="height"
      opacity="0"
      :data-key="node.id"
      data-el-type="node"
      data-mouse-style="pointer"
      class="key-shape"
      rx="8"
    />
    <g opacity="0">
      <rect
        :data-key="node.id"
        data-mouse-style="nwse-resize"
        data-type="node"
        data-el-type="resize"
        data-direction="lt"
        x="-2.5"
        y="-2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-key="node.id"
        data-mouse-style="nesw-resize"
        data-el-type="resize"
        data-type="node"
        data-direction="rt"
        :x="width - 2.5"
        y="-2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-key="node.id"
        data-mouse-style="ns-resize"
        data-el-type="resize"
        data-type="node"
        data-direction="t"
        x="2.5"
        y="-2.5"
        :width="width - 5"
        height="5"
      />
      <rect
        :data-key="node.id"
        data-el-type="resize"
        data-mouse-style="ns-resize"
        data-type="node"
        data-direction="b"
        x="2.5"
        :y="height - 2.5"
        :width="width - 5"
        height="5"
      />
      <rect
        :data-key="node.id"
        data-el-type="resize"
        data-mouse-style="ew-resize"
        data-type="node"
        data-direction="l"
        x="-2.5"
        y="2.5"
        :width="5"
        :height="height - 5"
      />
      <rect
        :data-key="node.id"
        data-el-type="resize"
        data-mouse-style="ew-resize"
        data-type="node"
        data-direction="r"
        :x="width - 2.5"
        y="2.5"
        :width="5"
        :height="height - 5"
      />
      <rect
        :data-key="node.id"
        data-el-type="resize"
        data-mouse-style="nesw-resize"
        data-type="node"
        data-direction="lb"
        x="-2.5"
        :y="height - 2.5"
        fill="red"
        width="5"
        height="5"
      />
      <rect
        :data-key="node.id"
        data-el-type="resize"
        data-mouse-style="nwse-resize"
        data-type="node"
        data-direction="rb"
        :x="width - 2.5"
        :y="height - 2.5"
        fill="red"
        width="5"
        height="5"
      />
    </g>
    <g class="anchor">
      <circle
        :cy="height / 2"
        r="5"
        stroke="#000"
        fill="#f0f2f5"
        stroke-width="0.8"
        data-type="node"
        data-mouse-style="pointer"
        data-el-type="anchor"
        :data-key="node.id"
        data-anchor="left"
      />
      <circle
        :cx="width"
        :cy="height / 2"
        r="5"
        stroke="#000"
        fill="#f0f2f5"
        stroke-width="0.8"
        data-type="node"
        data-mouse-style="pointer"
        data-el-type="anchor"
        :data-key="node.id"
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
    -webkit-line-clamp: v-bind(lineCount);
    -webkit-box-orient: vertical;
  }
}
</style>
