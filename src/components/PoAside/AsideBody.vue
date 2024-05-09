<script setup lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable/src/vuedraggable'

const list = ref(Array.from({ length: 3 }, (_, k) => {
  return { id: k, value: k }
}))

function onstart() {

}

function onend() {

}

function onupdate() {

}

</script>

<template>
  <draggable :list="list"
             id="aside-body"
             item-key="id"
             chosenClass="chosen-class"
             dragClass="drag-class"
             handle=".move"
             ghostClass="ghost-class"
             :forceFallback="true"
             animation="300"
             @start="onstart"
             @end="onend"
             @update="onupdate">
    <template #item="{ element }">
      <div class="operation move">{{ element.value }}</div>
    </template>
  </draggable>
</template>

<style scoped>
#aside-body {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  & > * {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    height: 40px;
    padding: 4px;
    margin: 4px;
    user-select: none;
  }
}
</style>