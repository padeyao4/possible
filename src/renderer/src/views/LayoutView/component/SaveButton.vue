<script setup lang="ts">

import Tip from "@renderer/component/Tip.vue";
import {SaveOne} from "@icon-park/vue-next";
import {dumps} from "@renderer/util/data";

function save() {
  window.api.exportData(dumps())
}
</script>

<template>
  <div class="save-button">
    <tip content="保存">
      <save-one class="save-one" theme="outline" size="20" fill="#333" :strokeWidth="2" @click="save"/>
    </tip>
  </div>
</template>

<style scoped>
.save-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;

  .save-one {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    background: rgba(37, 159, 167, 0.1);
  }
}
</style>
