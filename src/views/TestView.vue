<template>
  <div>
    <button @click="handleClick">+/ADD</button>
    <div class="main" @wheel="handleWheel">
      <div class="test" style="translate: 100px" v-for="item in arr" :key="item" :style="{translate: translateX+'px'}">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const arr = ref([])

for (let i = 0; i < 5; i++) {
  arr.value.push(i)
}

const translateX = ref(0)

function handleClick() {
  translateX.value += 50
}

const handleWheel = (e) => {
  let dx = e.deltaY / 5;
  translateX.value += dx;
}


</script>
<style scoped>
.main {
  background-color: rgb(0, 58, 39);
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.test {
  /* absolute定位是相对于找到最近的祖先元素包含position的元素 */
  display: inline-block;
  border: 1px solid;
  width: 100px;
  color: wheat;
  margin: 0 50px 0 50px;
}
</style>