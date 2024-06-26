<script setup lang="ts">
import draggable from 'vuedraggable';

const list = defineModel<any[]>();

console.log(list.value);

function ondragend() {}

function ondragstart() {}

function onupdate() {}
</script>

<template>
  <div>
    <draggable
      :list="list"
      item-key="id"
      chosenClass="chosen-class"
      dragClass="drag-class"
      handle=".move"
      ghostClass="ghost-class"
      :forceFallback="true"
      animation="300"
      @end="ondragend"
      @start="ondragstart"
      @update="onupdate"
    >
      <template #item="{ element }">
        <slot name="default" :item="element" />
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  background-color: #b88230;
}

.ghost-class {
  opacity: 0;
}

.drag-class {
  display: flex;
  background: #e5ebef;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
}
</style>
