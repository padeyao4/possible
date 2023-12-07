<script setup lang="ts">
import {useStore} from "@renderer/store/project";
import Draggable from 'vuedraggable/src/vuedraggable'
import router from "@renderer/router";
import {useRoute} from "vue-router";
import {computed, reactive} from "vue";
import ListContextMenu from "@renderer/views/LayoutView/component/ListContextMenu.vue";

const props = defineProps<{ rename: Function | undefined }>()
const route = useRoute()
const store = useStore()

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
  return store.get(active.value)
})

let defaultMouseStyle = 'auto'

function onStart() {
  defaultMouseStyle = document.body.style.cursor
  document.body.style.cursor = 'move'
}

function onEnd() {
  document.body.style.cursor = defaultMouseStyle
}

function handleInput() {
  if (project.value.name.trim() === '') {
    project.value.name = 'untitled'
  }
  props.rename?.()
}

const context = reactive({
  x: 0,
  y: 0,
  visible: false,
  projectId: '',
  active: ''
})

function showContextMenu(e: any, id: string) {
  console.log(e, id)
  context.x = e.x
  context.y = e.y
  context.visible = true
  context.projectId = id
  context.active = active.value
}

</script>

<template>
  <div class="main-side-list">
    <teleport to="body">
      <list-context-menu :x="context.x" :y="context.y" v-model:visible="context.visible"
                         :active="context.active"
                         :project-id="context.projectId"/>
    </teleport>
    <draggable :list="store.projects" item-key="id" animation="300"
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
            :key="element.id"
            @contextmenu.prevent="(e)=>showContextMenu(e,element.id)"
        >
          <div class="text">
            {{ element.name }}
          </div>
        </div>
      </template>
    </draggable>
    <div v-show="props.rename" class="list-item active">
      <input
          :ref="(e) => {(e as HTMLInputElement)?.focus()}"
          v-model="project.name"
          class="item-input"
          @blur="handleInput"
          @keydown.enter="handleInput"
      />
    </div>
  </div>
</template>

<style scoped>
.main-side-list {
  height: calc(var(--win-height) - 104px) !important;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  width: 240px !important;

  .list-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    user-select: none;
    margin: 4px 8px;
    padding: 0 8px 0 8px;
    background: var(--color-background);

    &:hover {
      border-radius: 4px;
      background: var(--color-side-active);
    }
  }

  .text {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
    word-break: break-all;
    white-space: nowrap;
  }

  .item-input {
    outline-style: none;
    text-align: center;
    border: 0;
    font-size: 15px;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0);
  }

  .active {
    border-radius: 4px;
    background: var(--color-side-active);
  }
}

</style>
