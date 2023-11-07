<script setup lang="ts">
import {useProjectStore} from "@renderer/store/project";
import Draggable from 'vuedraggable/src/vuedraggable'
import router from "@renderer/router";
import {useRoute} from "vue-router";
import {computed} from "vue";

const props = defineProps<{ rename: Function | undefined }>()
const route = useRoute()
const projectStore = useProjectStore()

const handleItemClick = (id: string) => {
  router.push({
    path: `/project/${id}`,
    replace: true
  })
}

const active = computed(() => {
  return (route.params.id ?? 'default') as string
})

const project = computed(() => {
  return projectStore.get(active.value)
})

let defaultMouseStyle = 'auto'

function onStart() {
  defaultMouseStyle = document.body.style.cursor
  document.body.style.cursor = 'move'
}

function onEnd() {
  document.body.style.cursor = defaultMouseStyle
}
</script>

<template>
    <div class="main-side-list">
      <draggable :list="projectStore.projects" item-key="id" animation="300"
                 :forceFallback="true" ghost-class="ghost-class" drag-class="drag-class"
                 @start="onStart"
                 @end="onEnd"
                 delay="100"
      >
        <template #item="{element}">
          <div
              v-show="!(element.id === project.id&&props.rename)"
              class="list-item"
              :class="{ 'active': element.id === active }"
              @click="()=>{handleItemClick(element.id)}"
          >
            {{ element.name }}
          </div>
        </template>
      </draggable>
      <div v-show="rename" class="list-item active">
        <input
            :ref="(e) => {(e as HTMLInputElement)?.focus()}"
            v-model="project.name"
            class="item-input"
            @blur="()=>{rename?.()}"
            @keydown.enter="()=>{rename?.()}"
        />
      </div>
    </div>
</template>

<style scoped>
.main-side-list {
  height: calc(var(--win-height) - 104px) !important;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;

  .list-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
    margin: 4px 8px;
    background: var(--color-background);

    &:hover {
      border-radius: 4px;
      background: var(--color-side-active);
    }
  }

  .item-input {
    outline-style: none;
    box-sizing: content-box;
    text-align: center;
    border: 0;
    font-size: 15px;
    background-color: rgba(0, 0, 0, 0);
  }

  .active {
    border-radius: 4px;
    background: var(--color-side-active);
  }
}

</style>
