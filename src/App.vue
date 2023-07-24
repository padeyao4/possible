<template>
  <div class="main">
    <div class="side">
      <button>
        <RouterLink to="home">
          我的一天
        </RouterLink>
      </button>
      <button>
        <RouterLink to="about">
          生活规划
        </RouterLink>
      </button>
      <hr />
      <div class="project-list">

      </div>
      <button>
        新建项目
      </button>
    </div>
    <div>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

.main {
  display: grid;
  grid-template-columns: 240px auto;
}

.side {
  display: grid;
  grid-template-rows: 1fr auto;
  background: black;
  color: white;

  & hr {
    height: 1px;
    border: none;
    border-top: 1px solid #323232;
  }
}

.active {
  color: rgb(45, 126, 167);
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  background: black;
  cursor: default;
  user-select: none;

  &:hover {
    background: gray;
  }
}

.project-list {
  overflow-y: auto;
  height: calc(100vh - 120px);
}

.content {
  background-color: black;
  height: 100vh;
}
</style>