<template>
  <div class="header">
    <div class="title"></div>
    <div></div>
  </div>
  <div class="body">

  </div>
  <div class="footer">

  </div>
</template>

<script setup>
</script>

<style>
.header {
  position: sticky;
  top: 0px;
  z-index: 99;
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
  background: green;
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