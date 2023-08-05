<template>
  <div>
    <div class="main">
      <div class="header" @wheel="handleWheel" ref="header" id="header">
        <div class="time-item" v-for="time in times">{{ time }}</div>
      </div>
      <div class="body">
        <div id="container"></div>
      </div>
      <div class="footer">
      </div>
    </div>
  </div>
</template>

<script setup>
import G6 from '@antv/g6';
import {onMounted, ref} from 'vue';

let times = []
for (let i = 0; i < 100; i++) {
  times.push(i)
}

const header = ref(undefined)

const handleWheel = (e) => {
  let ox = header.value.scrollLeft
  header.value.scrollLeft = ox + e.deltaY
}

onMounted(() => {
  const data = {
    nodes: [
      {
        id: 'node',
        x: 0,
        y: 200,
        type: 'circle',
        style: {
          fill: '#00FFFF', // 节点填充色
          stroke: '#FFFF00',  // 节点的描边颜色
          lineWidth: 5,       // 描边宽度
          // ... 其他属性
        },
      }
    ]
  }
  const graph = new G6.Graph({
    container: "container",
    renderer: 'svg',
    width: 800,
    height: 500
  });

  graph.data(data);

  graph.render();
});


</script>

<style scoped>

.main {
  background-color: #9f9f9f;
  overflow: hidden;
}

.header {
  position: sticky;
  top: 0;
  z-index: 99;
  -webkit-user-select: none;
  user-select: none;
  height: 60px;
  display: flex;
  align-items: center;
  overflow-x: hidden;

  .time-item {
    width: 100px;
    flex-shrink: 0;
    background-color: #1c1c1c;
    margin: 0 10px 0 10px;
  }
}


.body {
  padding: 0 20px;
  border: #222222 solid;
  overflow-y: auto;
  height: calc(100vh - 100px);
  background-color: #2c3e50;
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
  //padding: auto 5px; -webkit-user-select: none; user-select: none; min-width: 40px; min-height: 30px; border-radius: 10%;

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