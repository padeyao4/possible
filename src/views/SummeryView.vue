<template>
  <div class="header">
    <div class="title"></div>
    <div></div>
  </div>
  <div class="body">
    <div ref="container" id="container"></div>
  </div>
  <div class="footer">
  </div>
</template>

<script setup>
import G6 from '@antv/g6';
import { onMounted } from 'vue';

onMounted(() => {
  const data = {
    // 节点集
    nodes: [
      {
        id: 'node1', // 节点的唯一标识
        x: 100, // 节点横坐标
        y: 200, // 节点纵坐标
        label: '起始点', // 节点文本
        size: 50, // 节点大小
        type: 'circle', //指定节点类型，内置节点类型名称或自定义节点的名称。默认为 'circle'
        // 指定边连入节点的连接点的位置（相对于该节点而言），可以为空。
        // 例如: [0, 0]，代表节点左上角的锚点，[1, 1],代表节点右下角的锚点
        anchorPoints: [],
        //节点的样式属性
        style: {
          fill: '#00FFFF', // 节点填充色
          stroke: '#FFFF00',  // 节点的描边颜色
          lineWidth: 5,       // 描边宽度 
          // ... 其他属性
        },
        //	文本配置项
        labelCfg: {
          position: 'bottom', // 文本相对于节点的位置
          offset: 10, // 文本的偏移
          style: {    // 标签的样式属性。
            fill: 'red', // 文本颜色
          },
        },
      },
      {
        id: 'node2',
        x: 300,
        y: 200,
        label: '目标点',
      },
    ],
    // 边集
    edges: [
      // 表示一条从 node1 节点连接到 node2 节点的边
      {
        source: 'node1', // 起始点 id
        target: 'node2', // 目标点 id
        label: '我是连线', // 边的文本
        style: {
          stroke: '#000000',
          lineWidth: 5,
          // ... 其他样式属性
        },
      },
    ],
  };

  const graph = new G6.Graph({
    container: "container",
    width: 800,
    height: 500
  });

  graph.data(data);

  graph.render();
});


</script>

<style>
.header {
  position: sticky;
  top: 0px;
  z-index: 99;
  -webkit-user-select: none;
  user-select: none;
}

.title {
  display: flex;
  align-items: center;
  height: 60px;
  font-size: large;
}

.time-sheet {
  padding: 10px 0;

  div {
    overflow: hidden;
  }
}

.time-cell {
  overflow: hidden;
}

.body {
  padding: 0 20px;
  overflow-y: auto;
  height: calc(100vh - 100px);
  background: rgb(255, 255, 255);
}

.footer {
  position: sticky;
  bottom: 0;
  height: 40px;
  background: whitesmoke;
  display: flex;
  justify-content: space-between;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    padding: auto 5px;
    -webkit-user-select: none;
    user-select: none;
    min-width: 40px;
    min-height: 30px;
    border-radius: 10%;

    &:hover {
      background: wheat;
    }
  }

  input[type='range'] {
    background-size: 50% 3px;
    margin: auto 0;
    width: 40%;
    background: linear-gradient(to right, #ccc 0%, #ccc 100%);
    outline: none;
    /*清除系统默认样式*/
    -webkit-appearance: none;
    appearance: none;
    /*横条的高度*/
    height: 3px;

    &::-webkit-slider-thumb {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: black;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      -webkit-appearance: none;
      border: 0;
    }
  }
}
</style>